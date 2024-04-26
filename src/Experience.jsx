import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF, OrbitControls } from '@react-three/drei'

import { useThree, useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three'; // Import only what you need
import React, { useState, useRef, useEffect } from 'react'; // Import useState
import { useSpring, animated } from '@react-spring/three';  // Make sure to import animated from react-spring/three




export default function Experience() {
    // const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
    const vending = useGLTF('models/vending.glb')
    const cupcake = useGLTF('models/cupcake.glb')
    const { scene } = useGLTF('models/cupcake.glb');
    const [meshCount, setMeshCount] = useState(0); // for debugging 

    const vendingRef = useRef();
    const cupcakeRef = useRef();
    const { camera } = useThree();
    const [azimuth, setAzimuth] = useState([-1, 0.75]); // Initial azimuth angle
    const [rotation, setRotation] = useState([0.04, -.12, 0]); // Initial rotation
    const [floatRotation, setFloatRotation] = useState(0.5); // Initial rotation
    const [floatSpeed, setFloatSpeed] = useState(1); // Initial rotation
    const [floatIntensity, setFloatIntensity] = useState(1); // Initial rotation
    const [step, setStep] = useState(0);  // Track the current step


    // cupcake mesh goes from bottom to top so cupcake base muffin top to frosting
    const [colors, setColors] = useState(['#EAD998', '#EAD998', '#F6EECF']);

    // const colors = ['hotpink', 'lightblue', 'yellowgreen'];




    const [flavors, setFlavors] = useState({
        vanilla: true,
        chocolate: false,
        redVelvet: false
    });
    const [frostings, setFrostings] = useState({
        vanilla: true, // TODO: change to false to allow users to select no frosting
        chocolate: false,
        strawberry: false,
        orange: false
    });


    const [shakeProps, setShake] = useSpring(() => ({
        from: { rotation: [0, 0, 0], opacity: 1 },
        rotation: [0, 0, 0],
        reset: true,
        opacity: 1,
        reset: true,
        // onRest: () => {
        //     console.log("Shake animation completed.");
        //     // setCupcake({ opacity: 1 });  // Make sure this is the only place where opacity is set to 1.
        // }
    }));

    const [cupcakeProps, setCupcake] = useSpring(() => ({
        scale: [.1, .1, .1],
        position: [.4, -.2, -2],
        opacity: 0,
        color: 'green',  // Default color
        metalness: 1,
        from: { opacity: 0, color: 'blue', scale: [0.1, 0.1, 0.1], position: [.4, -.2, -2], metalness: 1 },
    }));



    useFrame(() => {
        if (cupcakeRef.current) {
            cupcakeRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = cupcakeProps.opacity.get(); // Update opacity dynamically
                }
            });
        }
        // Makes wrap dissapear altogether
        // if (vendingRef.current) {
        //     vendingRef.current.traverse((child) => {
        //         if (child.isMesh) {
        //             child.material.transparent = true;
        //             child.material.opacity = shakeProps.opacity.get(); // Update opacity dynamically
        //         }
        //     });
        // }
    });

    // use for color change of cupcake
    useEffect(() => {
        let meshIndex = 0;
        if (cupcakeRef.current) {
            cupcakeRef.current.traverse((child) => {
                if (child.isMesh && meshIndex < colors.length) {
                    const oldMaterial = child.material;
                    child.material = new MeshStandardMaterial({
                        color: colors[meshIndex],
                        transparent: true, // Set transparency if needed
                        opacity: 0.5 // Set initial opacity if it won't change dynamically
                    });
                    meshIndex++;
                }
            });
        }
    }, [cupcakeRef.current]); // Ensure it runs only when cupcakeRef updates


    // useFrame(() => {
    //     if (cupcakeRef.current) {
    //         let firstMeshModified = false;
    //         cupcakeRef.current.traverse((child) => {
    //             if (child.isMesh && !firstMeshModified) {
    //                 firstMeshModified = true;
    //                 child.material = new MeshStandardMaterial({
    //                     color: cupcakeProps.color.get(), // Set the initial color dynamically
    //                     transparent: true,
    //                     opacity: cupcakeProps.opacity.get()
    //                 });
    //             }
    //         });
    //     }
    // });

    useEffect(() => {
        let count = 0;
        scene.traverse((child) => {
            if (child.isMesh) {
                count++;
            }
        });
        setMeshCount(count);  // Update the state with the number of meshes found
    }, [scene]);






    function handleStartClick() {
        camera.position.z = 2
        camera.position.x = -1.5
        setAzimuth([azimuth[0] + 6.5, azimuth[1]]);
        setFloatRotation(0)
        setFloatSpeed(.7)
        setFloatIntensity(0.4)
        setStep(1);  // Move to step 1 when START is clicked
        // setRotation([rotation[0] + 1, rotation[1]])


        setCupcake({ scale: [.1, .1, .1], position: [.4, -.2, -2], opacity: 0, });
    }



    // const getFlavorImageSrc = () => {
    //     if (flavors.vanilla) return "/images/cake/cupcakesvanilla.png"; // Update with the correct path
    //     if (flavors.chocolate) return "/images/cake/cupcakeschocolate.png"; // Update with the correct path
    //     if (flavors.redVelvet) return "/images/cake/cupcakesred-velvet.png"; // Update with the correct path
    //     return "/images/cake/cupcakesvanilla.png"; // Default image when no flavor is selected
    // };

    const getFlavorImageSrc = () => {
        if (flavors.vanilla) return "/images/cake/cupcakesvanilla.png";
        if (flavors.chocolate) return "/images/cake/cupcakeschocolate.png";
        if (flavors.redVelvet) return "/images/cake/cupcakesred-velvet.png";
        return "/images/cake/cupcakesvanilla.png"; // Default image
    };

    const getFrostingImageSrc = () => {
        if (frostings.vanilla) return "/images/frosting/cupcakesfrostingVanilla.png";
        if (frostings.chocolate) return "/images/frosting/cupcakesfrostingChocolate.png";
        if (frostings.strawberry) return "/images/frosting/cupcakesfrostingPink.png";
        if (frostings.orange) return "/images/frosting/cupcakesfrostingOrange.png";
        return "/images/frosting/defaultFrosting.png"; // Default image if no frosting selected
    };

    const handleFlavorClick = (selectedFlavor) => {
        const newFlavors = {
            vanilla: selectedFlavor === 'vanilla',
            chocolate: selectedFlavor === 'chocolate',
            redVelvet: selectedFlavor === 'redVelvet'
        };
        setFlavors(newFlavors);

        // Update colors based on flavor directly here
        let newColors = [...colors];
        switch (selectedFlavor) {
            case 'vanilla':
                newColors[0] = '#EAD998';
                newColors[1] = '#EAD998';
                break;
            case 'chocolate':
                newColors[0] = '#5B3F2E';
                newColors[1] = '#5B3F2E';
                break;
            case 'redVelvet':
                newColors[0] = '#9A3127';
                newColors[1] = '#9A3127';
                break;
            default:
                newColors[0] = '#EAD998';
                newColors[1] = '#EAD998';
                break;
        }
        setColors(newColors);
    };

    useEffect(() => {
        if (cupcakeRef.current) {
            let meshIndex = 0;
            cupcakeRef.current.traverse((child) => {
                if (child.isMesh && meshIndex < colors.length) {
                    child.material = new MeshStandardMaterial({
                        color: colors[meshIndex],
                        transparent: true,
                        opacity: 0.5
                    });
                    meshIndex++;
                }
            });
        }
    }, [colors]);  // Respond only to changes in colors


    useEffect(() => {
        if (cupcakeRef.current) {
            let meshIndex = 0;
            // Array of metalness and roughness settings for each mesh
            const settings = [
                { metalness: .3, roughness: .7 },  // bottom
                { metalness: 0.2, roughness: 1 }, // Muffin top
                { metalness: 0.8, roughness: 0.3 }  // frosting
            ];

            cupcakeRef.current.traverse((child) => {
                if (child.isMesh && meshIndex < settings.length) {
                    // Apply specific settings from the array
                    child.material.metalness = settings[meshIndex].metalness;
                    child.material.roughness = settings[meshIndex].roughness;
                    meshIndex++; // Increment to apply the next settings to the next mesh
                }
            });
        }
    }, [colors, cupcakeRef]); // Dependency on the cupcakeRef to ensure it runs when the ref is updated

    const handleFrostingClick = (selectedFrosting) => {
        const newFrostings = {
            vanilla: false,
            chocolate: false,
            redVelvet: false,
            ...{ [selectedFrosting]: true }  // Set only the selected Frosting to true
        };
        setFrostings(newFrostings);

        // Update colors based on frosting directly here
        let newColors = [...colors];
        switch (selectedFrosting) {
            case 'vanilla':
                newColors[2] = '#F6EECF';
                break;
            case 'chocolate':
                newColors[2] = '#472009';
                break;
            case 'strawberry':
                newColors[2] = '#FF5878';
                break;
            case 'orange':
                newColors[2] = '#F78029';
                break;
        }
        setColors(newColors);
    };





    const handleNextClick = () => {
        setStep(step + 1);
    };
    const handleBackClick = () => {
        setStep(step - 1);
    };

    const handleFinClick = () => {
        camera.position.z = 4
        camera.position.x = -3
        setAzimuth([-1, 0.75]);
        setRotation([0.04, -0.12, 0]);
        setFloatRotation(0.5)
        setFloatSpeed(1)
        setFloatIntensity(1)
        setStep(4);

        setShake({
            to: async (next, cancel) => {
                await next({ rotation: [0, .1, .1] });
                await next({ rotation: [0, -.1, -.1] });
                await next({ rotation: [0, .1, .1] });
                await next({ rotation: [0, -.1, -.1] });
                await next({ rotation: [0, .1, .1] });
                await next({ rotation: [0, -.1, -.1] });

                // await next({ position: [0, .5, 0] }); // hop animation
                await next({ rotation: [0, 0, 0], position: [0, -1.5, 0] });
                await next({ opacity: 0, duration: 100 });

                setCupcake({ opacity: 1, delay: 100 });
                setCupcake({ position: [.4, -.2, .95], delay: 300 });
                // setCupcake({ scale: [.8, .8, .8], delay: 300 });
                setShake({ opacity: 0, delay: 300 });
                setStep(5);


            },
            from: { rotation: [0, 0, 0], position: [0, -1.5, 0] },
            config: { tension: 50, friction: 5, duration: 400, opacity: 1 },

        }
        );



        console.log(`
          ___  _  _  ____   ___   __   __ _  ____  _   
        / __)/ )( \(  _ \ / __) / _\ (  / )(  __)/ \  
       ( (__ ) \/ ( ) __/( (__ /    \ )  (  ) _) \_/  
        \___)\____/(__)   \___)\_/\_/(__\_)(____)(_)  
`);
    };

    console.log('cupcake mesh count: ', meshCount)

    const handleCupcakeClick = () => {
        console.log('cupcake clicked');
        setStep(6);
        setCupcake({ scale: [.6, .6, .6], position: [-1, -.2, 2], delay: 300 });

    }


    return <>

        {/* <p>Number of meshes in the model: {meshCount}</p> */}

        <color args={['#F2D7F8']} attach="background" />

        <Environment preset="sunset" />

        <PresentationControls
            global
            rotation={[0.04, -.12, 0]}
            // rotation={rotation}
            polar={[- 0.4, 2]}
            azimuth={azimuth}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
        >
            <Float
                rotationIntensity={floatRotation}
                speed={floatSpeed}
                floatIntensity={floatIntensity}
            >
                {/* <rectAreaLight
                    width={.5}
                    height={1.65}
                    intensity={65}
                    color={'#F2D7F8'}
                    rotation={[- 0.1, Math.PI, 0]}
                    position={[0, 0.55, - 1.15]}
                /> */}

                <animated.primitive
                    object={vending.scene}
                    position-y={-1.5}
                    scale={0.9}
                    rotation-x={-0.08}
                    ref={vendingRef}
                    {...shakeProps}  // Apply the animated props here
                >
                    <Html
                        transform
                        wrapperClass="htmlScreen"
                        distanceFactor={.7}
                        // position={[0, 2.5, 1]}
                        position={[0, 2.5, .9]}
                        rotation-x={0}
                    >
                        {/* <iframe src="https://bruno-simon.com/html/" /> */}

                        {step === 0 && (
                            <button className="start" onClick={handleStartClick}>START</button>
                        )}
                        {step === 1 && (
                            <>
                                <div className='builder'>
                                    <div className='builerImg' style={{ top: `-20px` }}>
                                        <img className='cake' src={getFlavorImageSrc()} alt="Selected Flavor" />
                                    </div>
                                    <div className='builderButtons'>
                                        <button onClick={() => handleFlavorClick('vanilla')}>Vanilla</button>
                                        <button onClick={() => handleFlavorClick('chocolate')}>Chocolate</button>
                                        <button onClick={() => handleFlavorClick('redVelvet')}>Red Velvet</button>
                                        {/* <button onClick={handleNextClick}>Next →</button> */}
                                    </div>
                                </div>
                                <div className='navButtons' style={{ justifyContent: 'flex-end' }}>
                                    <button onClick={handleNextClick}>Next →</button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>

                                <div className='builder'>
                                    <div className='builerImg'>
                                        {/* Only render the image tag if frostingImageSrc is not null */}
                                        {getFrostingImageSrc() && <img className='frosting' src={getFrostingImageSrc()} alt="Selected Frosting" />}
                                        {/* <img className='frosting' src={getFrostingImageSrc()} alt="Selected Frosting" onError={(event) => event.target.style.display = 'none'} /> */}
                                        <img className='cake' src={getFlavorImageSrc()} alt="Selected Flavor" />
                                    </div>

                                    <div className='builderButtons'>
                                        <button onClick={() => handleFrostingClick('vanilla')}>Vanilla</button>
                                        <button onClick={() => handleFrostingClick('chocolate')}>Chocolate</button>
                                        <button onClick={() => handleFrostingClick('strawberry')}>Strawberry</button>
                                        <button onClick={() => handleFrostingClick('orange')}>Orange Cream</button>


                                    </div>
                                </div>
                                <div className='navButtons' style={{ top: '-150px' }}>
                                    <button onClick={handleBackClick}>←Back</button>
                                    <button onClick={handleNextClick}>Next →</button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <div className='fin'>
                                <div className='builerImg'>
                                    {getFrostingImageSrc() && <img className='frosting' src={getFrostingImageSrc()} alt="Selected Frosting" />}
                                    <img className='cake' src={getFlavorImageSrc()} alt="Selected Flavor" />
                                </div>

                                <div className='finButtons'>
                                    <button onClick={handleBackClick}>←Back</button>
                                    <button onClick={handleFinClick}>Finish</button>

                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className='fin'>
                                <p>One Moment Please</p>
                                <p>Making Cupcake...</p>
                            </div>
                        )}

                        {step === 5 && (
                            <div className='fin'>
                                <p>Grab Cupcake</p>
                                <p>: &#41;</p>
                            </div>
                        )}

                        {step === 6 && (
                            <div className='fin'>
                                <button className='start' onClick={handleStartClick}>StartOver</button>
                            </div>
                        )}

                    </Html>
                </animated.primitive>

                <animated.primitive
                    onClick={handleCupcakeClick}
                    object={cupcake.scene}
                    // position-y={-1.5}
                    // position={[.4, -.2, .9]}
                    scale={0.8}
                    rotation-x={-0.08}
                    ref={cupcakeRef}
                    {...cupcakeProps}
                >

                </animated.primitive>



            </Float>
        </PresentationControls>

        <ContactShadows
            position-y={- 1.4}
            opacity={0.4}
            scale={5}
            blur={2.4}
        />

        {/* <OrbitControls
            enableRotate={false}
            enableZoom={true}
            enablePan={false}
        /> */}



    </>
}