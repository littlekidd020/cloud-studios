import { useEffect, useRef, useState } from "react";
import { assets } from "./site.js";

const textures = [assets.desksTwo, assets.officeTwo, assets.meeting];

export function HeroScene() {
  const host = useRef(null);
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const element = host.current;
    if (!element || window.matchMedia("(max-width: 780px), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let renderer;
    let group;
    const pointer = { x: 0, y: 0 };
    let frameId;
    let visible = true;
    let disposed = false;

    const resize = () => {
      if (!renderer) return;
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.left = -4 * aspect;
      camera.right = 4 * aspect;
      camera.top = 4;
      camera.bottom = -4;
      camera.updateProjectionMatrix();
      group.scale.x = aspect;
    };
    const move = (event) => {
      const rect = element.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.05;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.03;
    };
    const render = () => {
      if (!renderer || !group) return;
      group.rotation.y += (pointer.x - group.rotation.y) * 0.035;
      group.rotation.x += (-pointer.y - group.rotation.x) * 0.035;
      renderer.render(scene, camera);
      if (visible) frameId = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frameId);
      if (visible) render();
    });

    let scene;
    let camera;
    import("three").then((THREE) => {
      if (disposed) return;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      element.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 20);
      camera.position.z = 8;
      group = new THREE.Group();
      scene.add(group);

      const loader = new THREE.TextureLoader();
      const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xf4f0e8, toneMapped: false, depthTest: false, depthWrite: false });
      const frames = [
        { x: 1.04, y: 2.52, z: 0, order: 1, w: 7.04, h: 2.96, r: 0.16, bl: 1.08, focusX: 0.5, focusY: 0.48, url: textures[0] },
        { x: 0.56, y: -1.68, z: 0.06, order: 2, w: 5.28, h: 2.56, r: 0.38, focusX: 0.52, focusY: 0.5, url: textures[2] },
        { x: -1.76, y: 0.32, z: 0.12, order: 3, w: 3.68, h: 1.76, r: 0.3, focusX: 0.52, focusY: 0.5, url: textures[1] },
      ];
      for (const frame of frames) {
        const texture = loader.load(frame.url, (loadedTexture) => coverTexture(loadedTexture, frame.w / frame.h, frame.focusX, frame.focusY));
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        const geometry = new THREE.ShapeGeometry(roundedRect(THREE, frame.w, frame.h, frame.r, frame.bl), 32);
        normalizeUvs(geometry);
        const border = new THREE.Mesh(geometry, borderMaterial);
        border.position.set(frame.x, frame.y, frame.z);
        border.scale.set(1.025, 1.045, 1);
        border.renderOrder = frame.order * 2;
        group.add(border);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, color: 0xfffbf5, toneMapped: false, depthTest: false, depthWrite: false }));
        mesh.position.set(frame.x, frame.y, frame.z);
        mesh.renderOrder = frame.order * 2 + 1;
        group.add(mesh);
      }

      resize();
      observer.observe(element);
      window.addEventListener("resize", resize);
      element.addEventListener("pointermove", move);
      setFallback(false);
      render();
    });

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      element.removeEventListener("pointermove", move);
      renderer?.dispose();
      group?.traverse((item) => {
        item.geometry?.dispose();
        item.material?.map?.dispose();
        item.material?.dispose();
      });
      renderer?.domElement.remove();
    };
  }, []);

  return <div className={`hero-scene ${fallback ? "is-fallback" : ""}`} ref={host} aria-hidden="true">
    {fallback && <StaticCollage />}
    <div className="address-card"><span>109</span>Great South Road<br />Epsom, Auckland<i>EPSOM</i></div>
  </div>;
}

function StaticCollage() {
  return <div className="static-collage">
    <img src={textures[0]} alt="" />
    <img src={textures[1]} alt="" />
    <img src={textures[2]} alt="" />
  </div>;
}

function roundedRect(THREE, width, height, radius, bottomLeftRadius = radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + bottomLeftRadius);
  shape.quadraticCurveTo(x, y, x + bottomLeftRadius, y);
  return shape;
}

function normalizeUvs(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let index = 0; index < position.count; index += 1) {
    uv.setXY(index, (position.getX(index) - min.x) / (max.x - min.x), (position.getY(index) - min.y) / (max.y - min.y));
  }
  uv.needsUpdate = true;
}

function coverTexture(texture, frameAspect, focusX = 0.5, focusY = 0.5) {
  const imageAspect = texture.image.width / texture.image.height;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);
  if (imageAspect > frameAspect) {
    texture.repeat.x = frameAspect / imageAspect;
    texture.offset.x = (1 - texture.repeat.x) * focusX;
  } else {
    texture.repeat.y = imageAspect / frameAspect;
    texture.offset.y = (1 - texture.repeat.y) * focusY;
  }
  texture.needsUpdate = true;
}
