import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, Html, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { chestBase64 } from './chestBase64.js';

export default function HoloCart3D(props) {
    const chestGroupRef = useRef();
    const timelineRef = useRef(null);
    
    // Referências para interface 3D HTML
    const panelRef = useRef();
    const btnRef = useRef();
    const flyingCardRef = useRef();
    
    const [cartGlow, setCartGlow] = useState(false);

    // CHEST
    const { scene: chestScene, materials: chestMaterials, animations: chestAnims } = useGLTF(`data:application/octet-stream;base64,${chestBase64}`);
    const chestClone = useMemo(() => SkeletonUtils.clone(chestScene), [chestScene]);
    const { nodes: chestNodes } = useGraph(chestClone);
    
    const { actions } = useAnimations(chestAnims, chestGroupRef);

    // Timeline GSAP
    useEffect(() => {
        let setupTimeout;
        const initAnimation = () => {
            if (!panelRef.current || !flyingCardRef.current || !btnRef.current || !chestGroupRef.current || !actions) {
                setupTimeout = setTimeout(initAnimation, 50);
                return;
            }

            // Habilita sombras Chest
            if (chestNodes.Object_7) {
                chestNodes.Object_7.castShadow = true;
                chestNodes.Object_7.receiveShadow = true;
            }

            const action = actions['ArmatureAction'];
            if (action) {
                action.play();
                action.paused = true; // Trava o tempo do Three.js para ser controlado exclusivamente pelo GSAP
                action.time = 0;      // Inicia com baú totalmente fechado
            }

            // Configura linha do tempo do GSAP
            if (timelineRef.current) timelineRef.current.kill();
            timelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

            // Reset inicial: Holograma e partícula recolhidos dentro do baú
            timelineRef.current
                .set(panelRef.current, { scale: 0, opacity: 0, y: 150, rotateX: 15 }) // Dentro do baú
                .set(flyingCardRef.current, { scale: 0, opacity: 0, x: 0, y: 0, rotation: 0 })
                .set(btnRef.current, { scale: 1, backgroundColor: 'rgba(168, 85, 247, 0.25)' })
                .set(chestGroupRef.current.rotation, { z: 0 }); 
                
            if (action) {
                timelineRef.current.set(action, { time: 0 });
            }

            // 1. Baú balança sutilmente (shake)
            timelineRef.current.to(chestGroupRef.current.rotation, { z: 0.08, duration: 0.06, ease: "power1.inOut" }, 0.2)
                .to(chestGroupRef.current.rotation, { z: -0.08, duration: 0.1, ease: "power1.inOut" })
                .to(chestGroupRef.current.rotation, { z: 0.08, duration: 0.1, ease: "power1.inOut" })
                .to(chestGroupRef.current.rotation, { z: 0, duration: 0.06, ease: "power1.inOut" });

            // 2. Tampa do baú ABRE e FICA ABERTA
            if (action) {
                timelineRef.current.to(action, { time: 1.4, duration: 0.6, ease: "power2.out" }, "+=0.1");
            }

            // 3. Painel holográfico surge DE DENTRO DO BAÚ (tampa permanece aberta)
            timelineRef.current.to(panelRef.current, { scale: 1, opacity: 1, y: -40, rotateX: 0, duration: 0.8, ease: "back.out(1.2)" }, "<0.1");

            // 4. Interação do botão no holograma
            timelineRef.current.to(btnRef.current, { scale: 1.1, backgroundColor: '#a855f7', duration: 0.2 }, "+=0.5");
            timelineRef.current.to(btnRef.current, { scale: 1, duration: 0.15 });

            // 5. O item/partícula surge e volta para DENTRO DO BAÚ junto com o painel holográfico
            timelineRef.current.set(flyingCardRef.current, { scale: 1, opacity: 1, x: 0, y: -10 });
            
            // Painel e partícula afundam juntos de volta para DENTRO DO BAÚ
            timelineRef.current.to(panelRef.current, { scale: 0, opacity: 0, y: 150, rotateX: 15, duration: 0.6, ease: "power2.in" }, "+=0.5");
            timelineRef.current.to(flyingCardRef.current, { scale: 0, opacity: 0, y: 50, duration: 0.5, ease: "power2.in" }, "<");
            
            // 6. SOMENTE DEPOIS que o holograma e a partícula entraram no baú, a TAMPA FECHA
            if (action) {
                timelineRef.current.to(action, { time: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.1");
            }
        };
        
        initAnimation();

        return () => {
            clearTimeout(setupTimeout);
            if (timelineRef.current) timelineRef.current.kill();
        };
    }, [chestNodes, actions]);

    return (
        <>
            <ambientLight intensity={0.5} color="#e9d5ff" />
            <directionalLight 
                position={[5, 10, 5]} 
                intensity={1.2} 
                color="#c084fc"
                castShadow 
                shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#6f42fb" />
            
            <group {...props} dispose={null}>
                {/* Baú Centralizado e mais para trás para não cobrir o holograma */}
                <group ref={chestGroupRef} scale={0.7} position={[0, -1.2, -0.4]} rotation={[0, 0, 0]}>
                    <primitive object={chestClone} />
                </group>

                {/* Interface Holográfica - Z ajustado para ficar mais pra frente */}
                <Html position={[0, 0.5, 0.4]} center zIndexRange={[100, 0]}>
                    <div style={{ position: 'relative', perspective: '1000px' }}>
                        
                        {/* Painel Holográfico da Loja */}
                        <div 
                            ref={panelRef}
                            style={{
                                width: '220px',
                                background: 'rgba(17, 18, 28, 0.85)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(168, 85, 247, 0.5)',
                                borderRadius: '12px',
                                padding: '12px',
                                boxShadow: '0 12px 40px rgba(111, 66, 251, 0.4), inset 0 0 25px rgba(168, 85, 247, 0.2)',
                                transformOrigin: 'bottom center',
                                pointerEvents: 'none'
                            }}
                        >
                            <h4 style={{ color: '#c084fc', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>
                                LEAD Store
                            </h4>
                            <div style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(168,85,247,0.3)',
                                borderRadius: '8px',
                                padding: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '20px' }}>📦</span>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>LeadEventoGuerra.jar</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>R$ 49,90</div>
                                </div>
                                <div 
                                    ref={btnRef}
                                    style={{
                                        background: 'rgba(168, 85, 247, 0.25)',
                                        border: '1px solid rgba(168, 85, 247, 0.4)',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        padding: '4px 8px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    + Adicionar
                                </div>
                            </div>
                        </div>

                        {/* Card Voador (O item que viaja para o carrinho) */}
                        <div 
                            ref={flyingCardRef}
                            style={{
                                position: 'absolute',
                                top: '50px',
                                left: '30px',
                                width: '40px',
                                height: '40px',
                                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23c084fc\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\'%3E%3C/path%3E%3Cpolyline points=\'3.27 6.96 12 12.01 20.73 6.96\'%3E%3C/polyline%3E%3Cline x1=\'12\' y1=\'22.08\' x2=\'12\' y2=\'12\'%3E%3C/line%3E%3C/svg%3E") no-repeat center center',
                                backgroundSize: 'contain',
                                filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))'
                            }}
                        />
                    </div>
                </Html>
            </group>
        </>
    );
}
