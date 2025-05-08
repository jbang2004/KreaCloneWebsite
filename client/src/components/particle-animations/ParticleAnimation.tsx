import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 基础粒子效果类型
export type ParticleType = 'audio' | 'speech' | 'video' | 'default';

// 粒子系统的基础属性接口
interface ParticleSystemProps {
  count: number;
  color: string | string[];
  size: number;
  speed: number;
  particleType: ParticleType;
}

// 粒子动画的主要属性接口
interface ParticleAnimationProps {
  type: ParticleType;
  className?: string;
  onComplete?: () => void;
  duration?: number; // 动画持续时间（毫秒）
  autoPlay?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

// 粒子的动态属性
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  initialPosition?: THREE.Vector3;
  targetPosition?: THREE.Vector3;
  phase?: number;
  amplitude?: number;
  frequency?: number;
}

// 为每种粒子类型定义不同的配置
const particleConfigs: Record<ParticleType, (intensity: string) => ParticleSystemProps> = {
  audio: (intensity) => ({
    count: intensity === 'high' ? 800 : intensity === 'medium' ? 500 : 300,
    color: ['#4F46E5', '#7C3AED', '#2563EB'],
    size: 0.05,
    speed: intensity === 'high' ? 0.8 : intensity === 'medium' ? 0.5 : 0.3,
    particleType: 'audio'
  }),
  speech: (intensity) => ({
    count: intensity === 'high' ? 1000 : intensity === 'medium' ? 600 : 400,
    color: ['#10B981', '#059669', '#047857'],
    size: 0.04,
    speed: intensity === 'high' ? 0.7 : intensity === 'medium' ? 0.45 : 0.25,
    particleType: 'speech'
  }),
  video: (intensity) => ({
    count: intensity === 'high' ? 1200 : intensity === 'medium' ? 800 : 500,
    color: ['#F59E0B', '#D97706', '#B45309'],
    size: 0.06,
    speed: intensity === 'high' ? 1 : intensity === 'medium' ? 0.7 : 0.4,
    particleType: 'video'
  }),
  default: (intensity) => ({
    count: intensity === 'high' ? 600 : intensity === 'medium' ? 400 : 200,
    color: ['#60A5FA', '#3B82F6', '#2563EB'],
    size: 0.05,
    speed: intensity === 'high' ? 0.6 : intensity === 'medium' ? 0.4 : 0.2,
    particleType: 'default'
  })
};

// 粒子系统组件
function ParticleSystem({ count, color, size, speed, particleType }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isAnimatingRef = useRef(true);
  const timeRef = useRef(0);

  // 初始化粒子系统
  useEffect(() => {
    if (!geometryRef.current) return;

    const particles: Particle[] = [];
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorArray = Array.isArray(color) ? color : [color];
    const colorObjects = colorArray.map(c => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      // 设置初始位置
      let x, y, z;
      
      if (particleType === 'audio') {
        // 音频粒子：水平音波形式
        x = (Math.random() - 0.5) * 5;
        y = (Math.random() - 0.5) * 5;
        z = (Math.random() - 0.5) * 5;
      } else if (particleType === 'speech') {
        // 语音粒子：从中心向外发散的圆形
        const radius = Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else if (particleType === 'video') {
        // 视频粒子：矩形框架，类似视频帧
        x = (Math.random() - 0.5) * 8;
        y = (Math.random() - 0.5) * 4.5; // 16:9 比例
        z = (Math.random() - 0.5) * 2;
      } else {
        // 默认粒子：随机分布
        x = (Math.random() - 0.5) * 6;
        y = (Math.random() - 0.5) * 6;
        z = (Math.random() - 0.5) * 6;
      }

      const position = new THREE.Vector3(x, y, z);
      
      // 设置初始速度
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed
      );
      
      particles.push({
        position,
        velocity,
        phase: Math.random() * Math.PI * 2, // 随机相位
        amplitude: Math.random() * 0.5 + 0.5, // 振幅
        frequency: Math.random() * 0.5 + 0.5, // 频率
      });
      
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // 设置颜色
      const colorIndex = Math.floor(Math.random() * colorObjects.length);
      const particleColor = colorObjects[colorIndex];
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }
    
    geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesRef.current = particles;
  }, [count, color, particleType]);
  
  // 动画帧更新
  useFrame((state, delta) => {
    if (!isAnimatingRef.current || !geometryRef.current || !pointsRef.current) return;
    
    timeRef.current += delta;
    const positions = geometryRef.current.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i];
      
      if (particleType === 'audio') {
        // 音频粒子: 波形图案运动
        particle.position.y = particle.amplitude! * Math.sin(timeRef.current * particle.frequency! + particle.phase!);
        particle.position.x += particle.velocity.x * delta * 0.5;
        if (Math.abs(particle.position.x) > 5) {
          particle.velocity.x *= -1;
        }
      } else if (particleType === 'speech') {
        // 语音粒子: 呼吸效果
        const scale = 1 + 0.2 * Math.sin(timeRef.current * 2 + particle.phase!);
        particle.position.x = particle.position.x * scale * 0.001 + particle.position.x * 0.999;
        particle.position.y = particle.position.y * scale * 0.001 + particle.position.y * 0.999;
        particle.position.z = particle.position.z * scale * 0.001 + particle.position.z * 0.999;
      } else if (particleType === 'video') {
        // 视频粒子: 跟随鼠标/视线移动
        particle.position.x += particle.velocity.x * delta;
        particle.position.y += particle.velocity.y * delta;
        particle.position.z += (Math.sin(timeRef.current) * 0.1) * particle.velocity.z;
        
        // 保持在视频框架边界内
        if (Math.abs(particle.position.x) > 4) particle.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 2.25) particle.velocity.y *= -1;
      } else {
        // 默认粒子: 随机漂浮运动
        particle.position.x += particle.velocity.x * delta;
        particle.position.y += particle.velocity.y * delta;
        particle.position.z += particle.velocity.z * delta;
        
        // 边界检查和反弹
        if (Math.abs(particle.position.x) > 3) particle.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 3) particle.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 3) particle.velocity.z *= -1;
      }
      
      // 更新位置
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
    }
    
    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 粒子动画主组件
export default function ParticleAnimation({
  type,
  className = '',
  onComplete,
  duration = 5000,
  autoPlay = true,
  intensity = 'medium'
}: ParticleAnimationProps) {
  const [isVisible, setIsVisible] = useState(autoPlay);
  
  // 动画完成后的回调
  useEffect(() => {
    if (!isVisible || !onComplete) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isVisible, onComplete, duration]);
  
  // 如果不可见，就不渲染Canvas
  if (!isVisible) return null;
  
  const config = particleConfigs[type](intensity);

  return (
    <div className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <ParticleSystem {...config} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}