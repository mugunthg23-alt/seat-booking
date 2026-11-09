import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ScreenConfig, SeatInfo, Movie, ViewQualityMetrics } from '../types';
import { createCinematicScreenCanvas, computeViewQuality } from '../utils/geometry';
import {
  RotateCcw,
  Eye,
  Compass,
  Sparkles,
  Layers,
  Sun,
  Moon,
  ZoomIn,
  Users,
} from 'lucide-react';

interface Auditorium3DProps {
  screenConfig: ScreenConfig;
  selectedSeats: SeatInfo[];
  activeSeatId: string | null;
  movie: Movie;
  isOverviewMode: boolean;
  onToggleOverview: (overview: boolean) => void;
  onSelectSeatChip: (seatId: string) => void;
  className?: string;
}

export const Auditorium3D: React.FC<Auditorium3DProps> = ({
  screenConfig,
  selectedSeats,
  activeSeatId,
  movie,
  isOverviewMode,
  onToggleOverview,
  onSelectSeatChip,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [isHouseLightsOn, setIsHouseLightsOn] = useState<boolean>(true);
  const [fovMode, setFovMode] = useState<'normal' | 'wide'>('wide');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Active seat object
  const activeSeat = useMemo(() => {
    if (!activeSeatId) return selectedSeats[0] || null;
    return selectedSeats.find((s) => s.id === activeSeatId) || selectedSeats[0] || null;
  }, [activeSeatId, selectedSeats]);

  // View quality metrics
  const viewMetrics: ViewQualityMetrics | null = useMemo(() => {
    if (!activeSeat) return null;
    return computeViewQuality(activeSeat, screenConfig.layout);
  }, [activeSeat, screenConfig.layout]);

  // State ref for smooth animation loop
  const stateRef = useRef({
    activeSeat,
    isOverviewMode,
    selectedSeats,
    isHouseLightsOn,
    fovMode,
    yaw: 0,
    pitch: -0.02,
    targetYaw: 0,
    targetPitch: -0.02,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerStartTargetYaw: 0,
    pointerStartTargetPitch: -0.02,
  });

  useEffect(() => {
    stateRef.current.activeSeat = activeSeat;
    stateRef.current.isOverviewMode = isOverviewMode;
    stateRef.current.selectedSeats = selectedSeats;
    stateRef.current.isHouseLightsOn = isHouseLightsOn;
    stateRef.current.fovMode = fovMode;
  }, [activeSeat, isOverviewMode, selectedSeats, isHouseLightsOn, fovMode]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isSoftwareGl = false;
    let renderer: THREE.WebGLRenderer;
    try {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) {
        setWebGlSupported(false);
        return;
      }
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);

      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 440;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Warm architectural backdrop
    scene.background = new THREE.Color(0xF5F2EB);
    scene.fog = new THREE.FogExp2(0xF5F2EB, 0.008);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 150);

    const layout = screenConfig.layout;
    const centerZ = layout.screenDistanceMeters + (layout.rows.length * layout.rowDistanceMeters) / 2;
    const totalDepth = layout.rows.length * layout.rowDistanceMeters + 6;
    const floorWidth = layout.screenWidthMeters * 1.5;
    const screenWidth = layout.screenWidthMeters;
    const screenHeight = layout.screenHeightMeters;
    const screenRadius = layout.screenCurvatureMeters;

    // Initial camera placement
    camera.position.set(0, screenHeight * 1.05, totalDepth + 2);
    camera.lookAt(0, screenHeight * 0.48, 0);

    const disposables: { dispose: () => void }[] = [];

    // ==========================================
    // 1. BALANCED HIGH-VISIBILITY LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.95);
    scene.add(ambientLight);

    // Subtle ambient hemisphere light specifically tuned to illuminate floor and side walls
    // Sky color (0xFFFAF0): Warm pearl illuminating ceiling and side walls
    // Ground color (0xD2C7B8): Soft sandstone bounce that gently lifts floor steps and lower walls
    const hemiAmbientLight = new THREE.HemisphereLight(0xFFFAF0, 0xD2C7B8, 0.65);
    scene.add(hemiAmbientLight);

    // Warm ceiling downlights illuminating seats and audience
    const houseDownlight1 = new THREE.DirectionalLight(0xffeed6, 1.4);
    houseDownlight1.position.set(0, 16, centerZ);
    scene.add(houseDownlight1);

    const houseDownlight2 = new THREE.DirectionalLight(0xfff6eb, 0.95);
    houseDownlight2.position.set(screenWidth * 0.6, 14, centerZ * 0.7);
    scene.add(houseDownlight2);

    const houseDownlight3 = new THREE.DirectionalLight(0xfff6eb, 0.95);
    houseDownlight3.position.set(-screenWidth * 0.6, 14, centerZ * 0.7);
    scene.add(houseDownlight3);

    // Lateral side-wall wash lights for soft, balanced architectural illumination
    const leftWallWash = new THREE.DirectionalLight(0xFFF6EB, 0.5);
    leftWallWash.position.set(-floorWidth * 0.45, 9, centerZ);
    scene.add(leftWallWash);

    const rightWallWash = new THREE.DirectionalLight(0xFFF6EB, 0.5);
    rightWallWash.position.set(floorWidth * 0.45, 9, centerZ);
    scene.add(rightWallWash);

    // Floor ambient fill light illuminating raked tiers and aisles evenly
    const floorWashLight = new THREE.DirectionalLight(0xFFF3E4, 0.6);
    floorWashLight.position.set(0, 11, centerZ * 0.9);
    scene.add(floorWashLight);

    // Screen projector glow & bounce light
    const screenBounceLight = new THREE.PointLight(0xffe4a0, 2.0, 45, 1.1);
    screenBounceLight.position.set(0, screenHeight * 0.5, 3.0);
    scene.add(screenBounceLight);

    // ==========================================
    // 2. FRONT ACOUSTIC WALL & STAGE PODIUM
    // ==========================================
    // Front Wall: Deep acoustic backdrop behind the screen frame
    const frontWallGeo = new THREE.PlaneGeometry(floorWidth * 1.2, screenHeight * 2.2);
    disposables.push(frontWallGeo);
    const frontWallMat = new THREE.MeshStandardMaterial({
      color: 0x1E1B18, // Deep dark acoustic bronze framing
      roughness: 0.7,
      metalness: 0.15,
    });
    disposables.push(frontWallMat);
    const frontWall = new THREE.Mesh(frontWallGeo, frontWallMat);
    frontWall.position.set(0, screenHeight * 0.6, -0.6);
    scene.add(frontWall);

    // Front Stage / Podium beneath screen
    const stageGeo = new THREE.BoxGeometry(screenWidth * 1.25, 0.6, 3.2);
    disposables.push(stageGeo);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x2A2622,
      roughness: 0.45,
      metalness: 0.2,
    });
    disposables.push(stageMat);
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(0, 0.3, 1.4);
    scene.add(stageMesh);

    // Stage Front Edge LED Glow Strip (Illuminates audience from the front)
    const stageGlowGeo = new THREE.BoxGeometry(screenWidth * 1.24, 0.04, 0.08);
    disposables.push(stageGlowGeo);
    const stageGlowMat = new THREE.MeshBasicMaterial({
      color: 0xF5C542,
    });
    disposables.push(stageGlowMat);
    const stageGlowMesh = new THREE.Mesh(stageGlowGeo, stageGlowMat);
    stageGlowMesh.position.set(0, 0.58, 2.96);
    scene.add(stageGlowMesh);

    const stageLight = new THREE.PointLight(0xF5C542, 1.2, 15, 1.5);
    stageLight.position.set(0, 0.8, 3.2);
    scene.add(stageLight);

    // ==========================================
    // 3. CURVED 4K CINEMA SCREEN (BRIGHT & CRISP)
    // ==========================================
    // Parabolic curved screen plane centered at X=0, facing +Z towards seats
    const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight, 48, 20);
    const pos = screenGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Parabolic arc curvature: edges arc slightly forward towards audience (+Z)
      const curveZ = (x * x) / (2 * screenRadius);
      pos.setZ(i, curveZ);
    }
    pos.needsUpdate = true;
    screenGeo.computeVertexNormals();
    disposables.push(screenGeo);

    // Create high-res canvas with the real movie poster and widescreen presentation
    const screenCanvas = createCinematicScreenCanvas(movie.title, movie.tagline, movie.posterAccent, movie.id);
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    disposables.push(screenTexture);

    // Load authentic movie poster directly onto screen canvas
    const posterImg = new Image();
    posterImg.crossOrigin = 'anonymous';
    posterImg.src = movie.posterUrl || `/posters/${movie.id}.jpg`;
    posterImg.onload = () => {
      const ctx = screenCanvas.getContext('2d');
      if (!ctx) return;
      const posterW = 540;
      const posterH = 810;
      const posterX = 220;
      const posterY = 195;

      // Draw authentic high-res poster
      ctx.shadowColor = 'rgba(248, 68, 100, 0.5)';
      ctx.shadowBlur = 50;
      ctx.drawImage(posterImg, posterX, posterY, posterW, posterH);
      ctx.shadowBlur = 0;

      // Coral red & bright white theatrical frame
      ctx.strokeStyle = '#F84464';
      ctx.lineWidth = 6;
      ctx.strokeRect(posterX, posterY, posterW, posterH);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(posterX + 4, posterY + 4, posterW - 8, posterH - 8);

      screenTexture.needsUpdate = true;
    };

    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: screenTexture,
      emissiveIntensity: 1.35, // Brilliant cinema projection!
      roughness: 0.1,
      metalness: 0.05,
      side: THREE.FrontSide,
    });
    disposables.push(screenMat);

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    // Screen is centered at (0, screenHeight * 0.48, 0)
    screenMesh.position.set(0, screenHeight * 0.48, 0);
    scene.add(screenMesh);

    // Architectural screen frame (Deep bronze outer with glowing gold inner bezel)
    const frameGeo = new THREE.PlaneGeometry(screenWidth + 0.8, screenHeight + 0.6, 48, 20);
    const fPos = frameGeo.attributes.position;
    for (let i = 0; i < fPos.count; i++) {
      const x = fPos.getX(i);
      const curveZ = (x * x) / (2 * screenRadius) - 0.05;
      fPos.setZ(i, curveZ);
    }
    fPos.needsUpdate = true;
    frameGeo.computeVertexNormals();
    disposables.push(frameGeo);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1A1714,
      roughness: 0.6,
      metalness: 0.35,
    });
    disposables.push(frameMat);
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, screenHeight * 0.48, 0);
    scene.add(frameMesh);

    // Inner Gold Bezel Ring
    const bezelGeo = new THREE.PlaneGeometry(screenWidth + 0.2, screenHeight + 0.2, 48, 20);
    const bPos = bezelGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const x = bPos.getX(i);
      const curveZ = (x * x) / (2 * screenRadius) - 0.018;
      bPos.setZ(i, curveZ);
    }
    bPos.needsUpdate = true;
    bezelGeo.computeVertexNormals();
    disposables.push(bezelGeo);

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xC8A35B,
      roughness: 0.22,
      metalness: 0.45,
    });
    disposables.push(bezelMat);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, screenHeight * 0.48, 0);
    scene.add(bezelMesh);

    // ==========================================
    // 4. RAKED AUDITORIUM FLOOR STEPS (HIGH CONTRAST)
    // ==========================================
    // Floor Material: Warm architectural heathered stone / travertine carpet
    // Balanced warm tone (0x524C46) that catches ambient bounce and wash light
    const stepMat = new THREE.MeshStandardMaterial({
      color: 0x524C46, // Refined warm architectural heathered slate
      roughness: 0.55,
      metalness: 0.08,
    });
    disposables.push(stepMat);

    // Step Tread Nosing: Polished warm brass tread with illuminated strip
    const treadMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.2,
      metalness: 0.5,
    });
    disposables.push(treadMat);

    layout.rows.forEach((row, rIdx) => {
      const zStart = layout.screenDistanceMeters + rIdx * layout.rowDistanceMeters - 0.2;
      const rakeRad = (layout.rakeAngleDeg * Math.PI) / 180;
      const yElev = Math.tan(rakeRad) * (rIdx * layout.rowDistanceMeters);
      const stepDepth = layout.rowDistanceMeters;

      const stepGeo = new THREE.BoxGeometry(floorWidth, 0.45, stepDepth);
      disposables.push(stepGeo);

      const stepMesh = new THREE.Mesh(stepGeo, stepMat);
      stepMesh.position.set(0, yElev - 0.22, zStart + stepDepth / 2);
      scene.add(stepMesh);

      // Polished brass tread along step edge
      const treadGeo = new THREE.BoxGeometry(floorWidth * 0.98, 0.03, 0.08);
      disposables.push(treadGeo);
      const treadMesh = new THREE.Mesh(treadGeo, treadMat);
      treadMesh.position.set(0, yElev + 0.015, zStart + stepDepth - 0.04);
      scene.add(treadMesh);

      // Step edge safety marker light at aisle gaps
      layout.aisleGapsAfter.forEach((gap) => {
        const seatSpacing = 0.65;
        const totalRowWidth = (layout.seatsPerRow - 1) * seatSpacing + layout.aisleGapsAfter.length * 0.8;
        const aisleX = (gap - 0.5) * seatSpacing + 0.4 - totalRowWidth / 2;

        const lightGeo = new THREE.SphereGeometry(0.04, 8, 8);
        disposables.push(lightGeo);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xF5C542 });
        disposables.push(lightMat);
        const lightMesh = new THREE.Mesh(lightGeo, lightMat);
        lightMesh.position.set(aisleX, yElev + 0.05, zStart + stepDepth - 0.04);
        scene.add(lightMesh);
      });
    });

    // ==========================================
    // 5. SIDE WALLS & CEILING
    // ==========================================
    const wallHeight = screenHeight * 1.6;
    const wallGeo = new THREE.BoxGeometry(0.3, wallHeight, totalDepth);
    disposables.push(wallGeo);

    // Warm champagne-linen acoustic paneling for walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xF0EBE2, // Luminous, warm architectural linen
      roughness: 0.55,
      metalness: 0.04,
    });
    disposables.push(wallMat);

    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-floorWidth / 2, wallHeight / 2 - 0.5, totalDepth / 2 + 1);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.position.set(floorWidth / 2, wallHeight / 2 - 0.5, totalDepth / 2 + 1);
    scene.add(rightWall);

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(floorWidth, wallHeight, 0.3);
    disposables.push(backWallGeo);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, wallHeight / 2 - 0.5, totalDepth + layout.screenDistanceMeters + 0.5);
    scene.add(backWall);

    // Ceiling
    const ceilingGeo = new THREE.BoxGeometry(floorWidth, 0.3, totalDepth);
    disposables.push(ceilingGeo);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xE8E3DA,
      roughness: 0.7,
      metalness: 0.05,
    });
    disposables.push(ceilingMat);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, wallHeight - 0.5, totalDepth / 2 + 1);
    scene.add(ceiling);

    // Sconces along side walls
    for (let w = 0; w < 4; w++) {
      const sconceZ = layout.screenDistanceMeters + (w * totalDepth) / 4 + 2;
      const sconceGeo = new THREE.BoxGeometry(0.15, 0.7, 0.22);
      disposables.push(sconceGeo);

      const sconceMeshL = new THREE.Mesh(sconceGeo, treadMat);
      sconceMeshL.position.set(-floorWidth / 2 + 0.15, 4.0, sconceZ);
      scene.add(sconceMeshL);

      const sconceMeshR = new THREE.Mesh(sconceGeo, treadMat);
      sconceMeshR.position.set(floorWidth / 2 - 0.15, 4.0, sconceZ);
      scene.add(sconceMeshR);

      const sconceLeft = new THREE.PointLight(0xffdfa8, 0.85, 14, 1.4);
      sconceLeft.position.set(-floorWidth / 2 + 0.6, 4.0, sconceZ);
      scene.add(sconceLeft);

      const sconceRight = new THREE.PointLight(0xffdfa8, 0.85, 14, 1.4);
      sconceRight.position.set(floorWidth / 2 - 0.6, 4.0, sconceZ);
      scene.add(sconceRight);
    }

    // ==========================================
    // 6. HIGH-VISIBILITY SEATS & AUDIENCE MEMBERS
    // ==========================================
    const seatBaseGeo = new THREE.BoxGeometry(0.56, 0.18, 0.5);
    const seatBackGeo = new THREE.BoxGeometry(0.56, 0.7, 0.15);
    seatBackGeo.translate(0, 0.38, -0.2);
    const armrestLeftGeo = new THREE.BoxGeometry(0.09, 0.32, 0.48);
    armrestLeftGeo.translate(-0.31, 0.16, 0);
    const armrestRightGeo = new THREE.BoxGeometry(0.09, 0.32, 0.48);
    armrestRightGeo.translate(0.31, 0.16, 0);

    const totalSeats = layout.rows.length * layout.seatsPerRow;

    // Slightly reflective, high-visibility cream/platinum leather upholstery
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0xF7F4EE, // Light warm ivory/cream
      roughness: 0.26, // Silky reflective specular sheen!
      metalness: 0.18, // Luminous leather reflection
    });
    disposables.push(seatMat);

    // Armrests with champagne bronze finish
    const armrestMat = new THREE.MeshStandardMaterial({
      color: 0xB5ABA0,
      roughness: 0.3,
      metalness: 0.25,
    });
    disposables.push(armrestMat);

    const instancedSeats = new THREE.InstancedMesh(seatBaseGeo, seatMat, totalSeats);
    const instancedBacks = new THREE.InstancedMesh(seatBackGeo, seatMat, totalSeats);
    const instancedArmrestsL = new THREE.InstancedMesh(armrestLeftGeo, armrestMat, totalSeats);
    const instancedArmrestsR = new THREE.InstancedMesh(armrestRightGeo, armrestMat, totalSeats);

    disposables.push(instancedSeats);
    disposables.push(instancedBacks);
    disposables.push(instancedArmrestsL);
    disposables.push(instancedArmrestsR);

    scene.add(instancedSeats);
    scene.add(instancedBacks);
    scene.add(instancedArmrestsL);
    scene.add(instancedArmrestsR);

    const seatIndexMap = new Map<string, number>();
    const dummy = new THREE.Object3D();
    let seatIndex = 0;

    // High-visibility seat colors:
    // Default Available: Light warm ivory/platinum
    // Selected: Radiant gleaming Brass (0xD4AF37)
    // Active current POV seat: Luminous brilliant Amber Gold (0xF59E0B)
    const defaultSeatColor = new THREE.Color(0xF7F4EE);
    const selectedSeatColor = new THREE.Color(0xD4AF37);
    const activeSeatColor = new THREE.Color(0xF59E0B);

    const rakeRad = (layout.rakeAngleDeg * Math.PI) / 180;

    // Audience silhouettes group
    const audienceGroup = new THREE.Group();
    scene.add(audienceGroup);

    // Audience materials: Natural theater clothing tones
    const audiencePalette = [
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.7 }), // Navy
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 }), // Slate
      new THREE.MeshStandardMaterial({ color: 0x581C87, roughness: 0.65 }), // Plum
      new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.65 }), // Wine
      new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.7 }), // Camel
      new THREE.MeshStandardMaterial({ color: 0x14532D, roughness: 0.7 }), // Forest
    ];
    audiencePalette.forEach((m) => disposables.push(m));

    const headMat = new THREE.MeshStandardMaterial({ color: 0xD8B4A0, roughness: 0.8 });
    disposables.push(headMat);

    layout.rows.forEach((row, rIdx) => {
      const zFromFirst = rIdx * layout.rowDistanceMeters;
      const z = layout.screenDistanceMeters + zFromFirst;
      const floorY = Math.tan(rakeRad) * zFromFirst;

      for (let num = 1; num <= layout.seatsPerRow; num++) {
        let aisleOffset = 0;
        layout.aisleGapsAfter.forEach((gap) => {
          if (num > gap) aisleOffset += 0.8;
        });
        const seatSpacing = 0.65;
        const totalRowWidth = (layout.seatsPerRow - 1) * seatSpacing + layout.aisleGapsAfter.length * 0.8;
        const rawX = (num - 1) * seatSpacing + aisleOffset;
        const x = rawX - totalRowWidth / 2;

        const seatId = `${row}-${num}`;
        seatIndexMap.set(seatId, seatIndex);

        dummy.position.set(x, floorY + 0.28, z);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();

        instancedSeats.setMatrixAt(seatIndex, dummy.matrix);
        instancedBacks.setMatrixAt(seatIndex, dummy.matrix);
        instancedArmrestsL.setMatrixAt(seatIndex, dummy.matrix);
        instancedArmrestsR.setMatrixAt(seatIndex, dummy.matrix);

        instancedSeats.setColorAt(seatIndex, defaultSeatColor);
        instancedBacks.setColorAt(seatIndex, defaultSeatColor);

        // Add stylized audience member in ~20% of pre-booked seats for rich, living cinema feel
        const isAudienceSpot = (rIdx * 7 + num * 13) % 5 === 0 && !(row === 'A' && num === 1);
        if (isAudienceSpot) {
          const audienceMember = new THREE.Group();
          audienceMember.name = `audience-${seatId}`;

          // Torso / Shoulders
          const torsoGeo = new THREE.BoxGeometry(0.44, 0.42, 0.28);
          disposables.push(torsoGeo);
          const torsoMat = audiencePalette[(rIdx + num) % audiencePalette.length];
          const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
          torsoMesh.position.set(0, 0.38, -0.06);
          audienceMember.add(torsoMesh);

          // Head
          const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
          disposables.push(headGeo);
          const headMesh = new THREE.Mesh(headGeo, headMat);
          headMesh.position.set(0, 0.68, -0.08);
          audienceMember.add(headMesh);

          audienceMember.position.set(x, floorY + 0.32, z);
          audienceGroup.add(audienceMember);
        }

        seatIndex++;
      }
    });

    instancedSeats.instanceMatrix.needsUpdate = true;
    instancedBacks.instanceMatrix.needsUpdate = true;
    instancedArmrestsL.instanceMatrix.needsUpdate = true;
    instancedArmrestsR.instanceMatrix.needsUpdate = true;

    // ==========================================
    // 7. RENDER LOOP WITH SMOOTH EXPONENTIAL DAMPING
    // ==========================================
    const curPos = camera.position.clone();
    const targetPos = new THREE.Vector3();
    const curLookAt = new THREE.Vector3(0, screenHeight * 0.48, 0);
    const targetLookAt = new THREE.Vector3(0, screenHeight * 0.48, 0);

    let frameId = 0;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      frameId = requestAnimationFrame(renderLoop);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const {
        activeSeat,
        isOverviewMode,
        selectedSeats,
        isHouseLightsOn,
        fovMode,
        targetYaw,
        targetPitch,
      } = stateRef.current;

      const targetFov = fovMode === 'wide' ? 74 : 56;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
        camera.updateProjectionMatrix();
      }

      // Dynamic House Lighting Intensity
      const targetAmbient = isHouseLightsOn ? 1.0 : 0.45;
      const targetHemi = isHouseLightsOn ? 0.65 : 0.28;
      const targetDownlight = isHouseLightsOn ? 1.4 : 0.35;
      const targetWallWash = isHouseLightsOn ? 0.5 : 0.18;
      const targetFloorWash = isHouseLightsOn ? 0.6 : 0.22;

      ambientLight.intensity = THREE.MathUtils.damp(ambientLight.intensity, targetAmbient, 6, dt);
      hemiAmbientLight.intensity = THREE.MathUtils.damp(hemiAmbientLight.intensity, targetHemi, 6, dt);
      houseDownlight1.intensity = THREE.MathUtils.damp(houseDownlight1.intensity, targetDownlight, 6, dt);
      leftWallWash.intensity = THREE.MathUtils.damp(leftWallWash.intensity, targetWallWash, 6, dt);
      rightWallWash.intensity = THREE.MathUtils.damp(rightWallWash.intensity, targetWallWash, 6, dt);
      floorWashLight.intensity = THREE.MathUtils.damp(floorWashLight.intensity, targetFloorWash, 6, dt);

      // Update seat instance colors dynamically based on selection
      const selectedIds = new Set(selectedSeats.map((s) => s.id));
      seatIndexMap.forEach((idx, sId) => {
        if (activeSeat && sId === activeSeat.id) {
          instancedSeats.setColorAt(idx, activeSeatColor);
          instancedBacks.setColorAt(idx, activeSeatColor);
        } else if (selectedIds.has(sId)) {
          instancedSeats.setColorAt(idx, selectedSeatColor);
          instancedBacks.setColorAt(idx, selectedSeatColor);
        } else {
          instancedSeats.setColorAt(idx, defaultSeatColor);
          instancedBacks.setColorAt(idx, defaultSeatColor);
        }
      });
      if (instancedSeats.instanceColor) instancedSeats.instanceColor.needsUpdate = true;
      if (instancedBacks.instanceColor) instancedBacks.instanceColor.needsUpdate = true;

      // Hide audience member if sitting in the active seat
      audienceGroup.children.forEach((child) => {
        if (activeSeat && child.name === `audience-${activeSeat.id}`) {
          child.visible = false;
        } else {
          child.visible = true;
        }
      });

      // Camera Positioning
      if (isOverviewMode || !activeSeat) {
        // OVERVIEW: High back elevation looking directly at the curved screen & audience
        const backZ = layout.screenDistanceMeters + layout.rows.length * layout.rowDistanceMeters + 2.5;
        targetPos.set(0, screenHeight * 1.05, backZ);
        // CRITICAL FIX: Look directly at the center of the screen (Z = 0)!
        targetLookAt.set(0, screenHeight * 0.48, 0);
      } else {
        // SEAT POV: Positioned right at eye level in the chosen seat chair
        targetPos.set(activeSeat.x, activeSeat.y + 0.15, activeSeat.z);

        stateRef.current.yaw = THREE.MathUtils.damp(stateRef.current.yaw, targetYaw, 8, dt);
        stateRef.current.pitch = THREE.MathUtils.damp(stateRef.current.pitch, targetPitch, 8, dt);

        const lookDist = activeSeat.z;
        const lookX = Math.sin(stateRef.current.yaw) * lookDist;
        const lookY = screenHeight * 0.48 + Math.sin(stateRef.current.pitch) * lookDist * 0.4;
        const lookZ = 0;

        targetLookAt.set(lookX, lookY, lookZ);
      }

      curPos.x = THREE.MathUtils.damp(curPos.x, targetPos.x, 6, dt);
      curPos.y = THREE.MathUtils.damp(curPos.y, targetPos.y, 6, dt);
      curPos.z = THREE.MathUtils.damp(curPos.z, targetPos.z, 6, dt);
      camera.position.copy(curPos);

      curLookAt.x = THREE.MathUtils.damp(curLookAt.x, targetLookAt.x, 6, dt);
      curLookAt.y = THREE.MathUtils.damp(curLookAt.y, targetLookAt.y, 6, dt);
      curLookAt.z = THREE.MathUtils.damp(curLookAt.z, targetLookAt.z, 6, dt);
      camera.lookAt(curLookAt);

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(renderLoop);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [screenConfig, movie]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOverviewMode) return;
    setIsDragging(true);
    stateRef.current.pointerStartX = e.clientX;
    stateRef.current.pointerStartY = e.clientY;
    stateRef.current.pointerStartTargetYaw = stateRef.current.targetYaw;
    stateRef.current.pointerStartTargetPitch = stateRef.current.targetPitch;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isOverviewMode) return;
    const deltaX = e.clientX - stateRef.current.pointerStartX;
    const deltaY = e.clientY - stateRef.current.pointerStartY;

    const maxYaw = (45 * Math.PI) / 180;
    const maxPitch = (25 * Math.PI) / 180;

    const newYaw = stateRef.current.pointerStartTargetYaw - (deltaX / 320) * maxYaw;
    const newPitch = stateRef.current.pointerStartTargetPitch + (deltaY / 280) * maxPitch;

    stateRef.current.targetYaw = Math.max(-maxYaw, Math.min(maxYaw, newYaw));
    stateRef.current.targetPitch = Math.max(-maxPitch, Math.min(maxPitch, newPitch));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleResetLook = () => {
    stateRef.current.targetYaw = 0;
    stateRef.current.targetPitch = -0.02;
  };

  return (
    <div className={`relative flex flex-col bg-white border border-[#E2DDD3] rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* 1. Header Bar: Mode & Selected Seat Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#FAF8F5] border-b border-[#E2DDD3] z-10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-[#A17424] uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            3D Seat Sightline
          </span>
          {activeSeat && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF0D9] text-[#845E1B] font-semibold border border-[#E8D4A8]">
              Row {activeSeat.row} • Seat {activeSeat.number} ({activeSeat.tier})
            </span>
          )}
        </div>

        {/* View Mode & Lighting Toggles */}
        <div className="flex items-center gap-2">
          {/* House Lighting Toggle */}
          <button
            type="button"
            onClick={() => setIsHouseLightsOn(!isHouseLightsOn)}
            className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 font-medium border ${
              isHouseLightsOn
                ? 'bg-[#FAF0D9] text-[#845E1B] border-[#C8A35B]'
                : 'bg-white text-[#4A5568] border-[#D1D5DB] hover:text-[#1A202C]'
            }`}
            title="Toggle House Lights (Bright View vs Showtime)"
          >
            {isHouseLightsOn ? <Sun className="w-3.5 h-3.5 text-[#C8A35B]" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isHouseLightsOn ? 'Lights: ON' : 'Cinema Dim'}</span>
          </button>

          {/* Seat POV vs Auditorium Overview */}
          <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white p-0.5">
            <button
              type="button"
              onClick={() => onToggleOverview(false)}
              className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1 font-medium ${
                !isOverviewMode
                  ? 'bg-[#0E1424] text-white shadow-sm'
                  : 'text-[#4A5568] hover:text-[#0E1424]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Seat POV</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleOverview(true)}
              className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1 font-medium ${
                isOverviewMode
                  ? 'bg-[#0E1424] text-white shadow-sm'
                  : 'text-[#4A5568] hover:text-[#0E1424]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Seat Selector Chips (when multiple seats selected) */}
      {selectedSeats.length > 1 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-[#E2DDD3] overflow-x-auto z-10">
          <span className="text-[11px] text-[#64748B] shrink-0 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Switch Seat POV:
          </span>
          {selectedSeats.map((seat) => {
            const isActive = seat.id === activeSeatId;
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => {
                  onSelectSeatChip(seat.id);
                  if (isOverviewMode) onToggleOverview(false);
                }}
                className={`px-2.5 py-1 text-xs rounded-md transition-all font-mono font-bold ${
                  isActive
                    ? 'bg-[#C8A35B] text-[#0E1424] shadow-md ring-2 ring-[#C8A35B]'
                    : 'bg-[#F1EFEA] text-[#2D3748] hover:bg-[#E5E2D9] border border-[#D8D3C5]'
                }`}
              >
                {seat.row}{seat.number}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Main 3D WebGL Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[360px] sm:h-[420px] lg:h-[490px] bg-[#F5F2EB] cursor-grab active:cursor-grabbing select-none ${
          !webGlSupported ? 'hidden' : ''
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* On-screen visual guide */}
        {!isOverviewMode ? (
          <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E2DDD3] text-[11px] text-[#0E1424] font-medium shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#C8A35B]" />
            <span>Drag to look around auditorium & screen (±45°)</span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E2DDD3] text-[11px] text-[#0E1424] font-medium shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#C8A35B]" />
            <span>Auditorium Overview: Screen & Audience Tiers</span>
          </div>
        )}

        {/* Floating Quick Action Controls (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          {!isOverviewMode && (
            <button
              type="button"
              onClick={handleResetLook}
              className="px-2.5 py-1.5 rounded-md bg-white/90 hover:bg-white border border-[#CBD5E1] text-[#0E1424] transition-colors text-xs flex items-center gap-1 shadow-md font-medium"
              title="Recenter view on screen center"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C8A35B]" />
              <span className="text-[11px]">Center Screen</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setFovMode((m) => (m === 'wide' ? 'normal' : 'wide'))}
            className="px-2.5 py-1.5 rounded-md bg-white/90 hover:bg-white border border-[#CBD5E1] text-[#0E1424] transition-colors text-xs flex items-center gap-1 shadow-md font-medium"
            title="Toggle Field of View"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#C8A35B]" />
            <span className="text-[11px]">{fovMode === 'wide' ? 'Ultrawide (74°)' : 'Standard (56°)'}</span>
          </button>
        </div>
      </div>

      {/* WebGL Graceful 2D Fallback */}
      {!webGlSupported && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5] min-h-[320px]">
          <div className="w-12 h-12 rounded-full border border-[#C8A35B] bg-[#FAF0D9] flex items-center justify-center text-[#845E1B] mb-3">
            <Eye className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg text-[#0E1424] font-semibold mb-1">
            Standard Seat Sightline Preview
          </h4>
          <p className="text-xs text-[#64748B] max-w-sm mb-4">
            Showing calculated geometric view metrics for your seat.
          </p>
          {activeSeat && (
            <div className="p-3.5 rounded-lg bg-white border border-[#E2DDD3] text-left text-xs text-[#0E1424] space-y-1.5 shadow-sm">
              <div><strong>Seat:</strong> Row {activeSeat.row}, Seat {activeSeat.number} ({activeSeat.tier})</div>
              <div><strong>Distance to screen:</strong> ~{Math.round(activeSeat.z * 10) / 10} meters</div>
              <div><strong>Field of view:</strong> ~{viewMetrics?.fieldOfViewDeg}°</div>
            </div>
          )}
        </div>
      )}

      {/* 4. View Quality Indicator Strip */}
      <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E2DDD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        {viewMetrics && activeSeat ? (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#0E1424] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A17424]" />
                <span className="text-[#845E1B] font-bold text-xs">{viewMetrics.label}</span>
                <span className="text-[#94A3B8]">•</span>
                <span className="text-[#475569] font-medium">{viewMetrics.distanceMeters}m to screen</span>
              </span>
              <span className="text-[11px] text-[#64748B] font-mono font-semibold">
                {viewMetrics.fieldOfViewDeg}° FOV • {viewMetrics.horizontalAngleDeg}° off-center
              </span>
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              {viewMetrics.description}
            </p>
          </div>
        ) : (
          <div className="text-xs text-[#64748B] italic py-1">
            Tap any seat on the map below to immediately sit in it and see your view in 3D.
          </div>
        )}
      </div>
    </div>
  );
};
