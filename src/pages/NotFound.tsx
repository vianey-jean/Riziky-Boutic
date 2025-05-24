
import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    text404?: THREE.Group;
    particles?: THREE.Points;
    animationId?: number;
  }>({});

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a0000, 50, 200);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Éclairage dramatique
    const ambientLight = new THREE.AmbientLight(0x330000, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xff3333, 2, 100);
    pointLight1.position.set(-20, 20, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xaa0000, 1.5, 80);
    pointLight2.position.set(20, -10, 5);
    scene.add(pointLight2);

    // Création du texte 404 en 3D
    const text404Group = new THREE.Group();
    
    // Fonction pour créer chaque chiffre
    const createDigit = (digit: string, xPosition: number) => {
      const digitGroup = new THREE.Group();
      
      // Géométrie principale du chiffre
      const geometry = new THREE.BoxGeometry(8, 12, 3);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        shininess: 100,
        specular: 0x444444
      });
      
      if (digit === '4') {
        // Créer le chiffre 4 avec plusieurs cubes
        const verticalLeft = new THREE.Mesh(geometry.clone().scale(0.3, 1, 1), material);
        verticalLeft.position.set(-2, 0, 0);
        digitGroup.add(verticalLeft);
        
        const horizontal = new THREE.Mesh(geometry.clone().scale(1, 0.2, 1), material);
        horizontal.position.set(0, 2, 0);
        digitGroup.add(horizontal);
        
        const verticalRight = new THREE.Mesh(geometry.clone().scale(0.3, 1, 1), material);
        verticalRight.position.set(2, 0, 0);
        digitGroup.add(verticalRight);
      } else if (digit === '0') {
        // Créer le chiffre 0 comme un tore
        const torusGeometry = new THREE.TorusGeometry(4, 2, 16, 32);
        const zeroMesh = new THREE.Mesh(torusGeometry, material);
        zeroMesh.rotation.x = Math.PI / 2;
        digitGroup.add(zeroMesh);
      }
      
      // Effets de particules autour de chaque chiffre
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xff6666,
        size: 0.5,
        transparent: true,
        opacity: 0.8
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      digitGroup.add(particles);
      
      digitGroup.position.x = xPosition;
      digitGroup.castShadow = true;
      digitGroup.receiveShadow = true;
      
      return digitGroup;
    };

    // Ajouter les chiffres 404
    text404Group.add(createDigit('4', -20));
    text404Group.add(createDigit('0', 0));
    text404Group.add(createDigit('4', 20));
    
    scene.add(text404Group);

    // Particules de fond
    const backgroundParticleGeometry = new THREE.BufferGeometry();
    const backgroundParticleCount = 500;
    const backgroundPositions = new Float32Array(backgroundParticleCount * 3);
    
    for (let i = 0; i < backgroundParticleCount * 3; i += 3) {
      backgroundPositions[i] = (Math.random() - 0.5) * 200;
      backgroundPositions[i + 1] = (Math.random() - 0.5) * 200;
      backgroundPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    
    backgroundParticleGeometry.setAttribute('position', new THREE.BufferAttribute(backgroundPositions, 3));
    const backgroundParticleMaterial = new THREE.PointsMaterial({
      color: 0x660000,
      size: 1,
      transparent: true,
      opacity: 0.6
    });
    
    const backgroundParticles = new THREE.Points(backgroundParticleGeometry, backgroundParticleMaterial);
    scene.add(backgroundParticles);

    // Position de la caméra
    camera.position.z = 50;
    camera.position.y = 5;

    // Stockage des références
    sceneRef.current = {
      scene,
      camera,
      renderer,
      text404: text404Group,
      particles: backgroundParticles
    };

    // Animation
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationId;

      const time = Date.now() * 0.001;

      // Animation du texte 404
      if (text404Group) {
        text404Group.rotation.y = Math.sin(time * 0.5) * 0.1;
        text404Group.rotation.x = Math.sin(time * 0.3) * 0.05;
        text404Group.position.y = Math.sin(time * 2) * 2;
        
        // Animation des chiffres individuels
        text404Group.children.forEach((digit, index) => {
          if (digit instanceof THREE.Group) {
            digit.rotation.z = Math.sin(time * (1 + index * 0.5)) * 0.1;
            digit.children.forEach((child) => {
              if (child instanceof THREE.Points) {
                child.rotation.y += 0.01;
                child.rotation.x += 0.005;
              }
            });
          }
        });
      }

      // Animation des particules de fond
      if (backgroundParticles) {
        backgroundParticles.rotation.y += 0.002;
        backgroundParticles.rotation.x += 0.001;
      }

      // Animation de la caméra
      camera.position.x = Math.sin(time * 0.5) * 10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Scène 3D */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(circle, rgba(20,0,0,1) 0%, rgba(0,0,0,1) 100%)' }}
      />
      
      {/* Overlay avec contenu */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 p-8 bg-black/50 backdrop-blur-sm rounded-2xl border border-red-900/30">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-400">
              ERREUR
            </h1>
            <p className="text-xl text-red-300 max-w-md mx-auto leading-relaxed">
              Oops! La page que vous recherchez semble avoir disparu dans le vide numérique.
            </p>
            <p className="text-sm text-red-400/70">
              Cette page n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-900/50"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </Button>
          </div>
        </div>
      </div>
      
      {/* Effets de gradient supplémentaires */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-red-900/10 pointer-events-none z-5" />
    </div>
  );
};

export default NotFound;
