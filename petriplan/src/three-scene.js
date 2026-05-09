import * as THREE from 'three';

export function initThreeScene() {
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights - High contrast dramatic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(-2, 2, 2);
    scene.add(rimLight);

    const redGlow = new THREE.PointLight(0xb22222, 5, 10);
    redGlow.position.set(2, 1, 2);
    scene.add(redGlow);

    // Group for entire heart system
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // --- ANATOMICAL HEART (Complex procedural model) ---
    const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95,
        emissive: 0x440000
    });

    // Ventricles (Main body)
    const mainBody = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 4), heartMaterial);
    mainBody.scale.set(0.9, 1.2, 0.8);
    heartGroup.add(mainBody);

    // Atria (Top chambers)
    const leftAtrium = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 3), heartMaterial);
    leftAtrium.position.set(-0.5, 0.8, 0.3);
    heartGroup.add(leftAtrium);

    const rightAtrium = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 3), heartMaterial);
    rightAtrium.position.set(0.5, 0.8, 0.3);
    heartGroup.add(rightAtrium);

    // Aorta (The big arch)
    const aortaCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 1.2, 0),
        new THREE.Vector3(0, 2.2, 0),
        new THREE.Vector3(-0.8, 1.8, -0.5)
    );
    const aortaGeom = new THREE.TubeGeometry(aortaCurve, 20, 0.25, 8, false);
    const aorta = new THREE.Mesh(aortaGeom, heartMaterial);
    heartGroup.add(aorta);

    // Pulmonary Artery
    const pulmonaryCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.8, 0.5),
        new THREE.Vector3(0.5, 1.5, 0.8),
        new THREE.Vector3(1.2, 1.2, 1.0)
    );
    const pulmonaryGeom = new THREE.TubeGeometry(pulmonaryCurve, 20, 0.2, 8, false);
    const pulmonary = new THREE.Mesh(pulmonaryGeom, heartMaterial);
    heartGroup.add(pulmonary);

    // --- VEINS (Red pulses) ---
    const veinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const veins = [];
    for (let i = 0; i < 12; i++) {
        const veinGeom = new THREE.CylinderGeometry(0.015, 0.015, 1.5);
        const vein = new THREE.Mesh(veinGeom, veinMaterial);
        vein.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2, 0.6);
        vein.rotation.set(Math.random(), Math.random(), Math.random());
        veins.push(vein);
        heartGroup.add(vein);
    }

    camera.position.z = 6;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Anatomical Heartbeat (Double pulse)
        const time = Date.now() * 0.006;
        const pulse = 1 + Math.pow(Math.sin(time), 4) * 0.1 + Math.pow(Math.sin(time + 0.3), 4) * 0.05;

        heartGroup.scale.set(pulse, pulse, pulse);
        heartGroup.rotation.y += 0.003;

        // Pulsating light
        redGlow.intensity = 2 + pulse * 4;

        renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Interaction
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        heartGroup.rotation.y = x * 0.6;
        heartGroup.rotation.x = y * 0.4;
    });
}
