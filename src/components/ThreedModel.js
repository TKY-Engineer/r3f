import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { BoxGeometry } from 'three';
import * as THREE from 'three';

// CustomCameraControls コンポーネントの定義
const CustomCameraControls = () => {
    // Three.js のカメラと WebGLRenderer の参照を取得
    const { camera, gl } = useThree();

    // OrbitControls の参照を保持するための useRef
    const controls = useRef();

    // マウス座標を保持するための useRef
    const mouse = useRef({ x: 0, y: 0 });

    // カメラのターゲット座標用の THREE.Vector3 オブジェクト
    const target = new THREE.Vector3();

    // マウスの動きを監視し、現在のマウス座標を更新する
    useEffect(() => {
        // マウス移動イベントのハンドラ関数
        const handleMouseMove = (event) => {
            // マウス座標を -1 ～ 1 の範囲に正規化
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        // マウス移動イベントリスナーをウィンドウに追加
        window.addEventListener('mousemove', handleMouseMove);

        // コンポーネントのクリーンアップ時にイベントリスナーを削除
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // 毎フレームごとにカメラのターゲット位置を更新する
    useFrame(() => {
        if (controls.current) {
            // マウス座標に基づいてターゲットを設定
            target.set(mouse.current.x, mouse.current.y, 0);

            // 現在のターゲット位置を補間してスムーズに移動
            controls.current.target.lerp(target, 0.05);

            // OrbitControls の状態を更新
            controls.current.update();
        }
    });

    // OrbitControls コンポーネントをレンダリング
    return (
        <OrbitControls
            ref={controls} // controls の参照を取得
            args={[camera, gl.domElement]} // カメラとレンダラーを渡す
            enabled={true} // コントロールを有効化
            minDistance={3} // カメラの最小距離
            maxDistance={5} // カメラの最大距離
            enableZoom={false} // ズームを無効化
            minPolarAngle={1} // 最小極角（上下方向の制限）
            maxPolarAngle={2} // 最大極角（上下方向の制限）
            minAzimuthAngle={-Math.PI / 6} // 最小方位角（左右方向の制限）
            maxAzimuthAngle={Math.PI / 4} // 最大方位角（左右方向の制限）
            fov={150} // カメラの視野角
        />
    );
};


export default function ThreedModel() {

  return (
   <>
    <Canvas>

              <ambientLight intensity={5} />
              <directionalLight
                  position={[-20, 20, 40]}
                  angle={0.15}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                  penumbra={1}
                  decay={0}
                  intensity={1}
                  receiveShadow
              />

              <CustomCameraControls />


            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>


    </Canvas>
   </>
  )
}
