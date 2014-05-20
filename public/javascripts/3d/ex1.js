$(function(){
    console.log(x);
    Ex1();
});
function Ex1(){
    //工具
    var gui = new dat.GUI();
    var colors = new function(){      
        this.planColor = "#ffffff";
        this.cubeColor = "#ff0000";
        this.sphereColor = "#7777ff";
    }
    
    //初始化
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;
    
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    
    //效果
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    //实体
    var planeGeometry = new THREE.PlaneGeometry(60,20,10,10);
    var planeMaterial = new THREE.MeshPhongMaterial({color:colors.planColor});
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);
    
    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshPhongMaterial({color:colors.cubeColor});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);
    
    var sphereGeometry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshPhongMaterial({color:colors.sphereColor});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    
    camera.position.x = 50;
    camera.position.y = 40;
    camera.position.z = 0;
    camera.lookAt(scene.position);
    
    //生成
    $("#canvas").append(renderer.domElement);
    
    //控制
    var i=0;
    var stats = initStats(i);
    var controls =new function(){
        this.radius = 40;
        this.speed = 0.5;
        this.numberOfObjects = scene.children.length+1;
        this.addCube = addCube;
        this.removeCube = rmCube;
    }
    
    var f1 = gui.addFolder('Configures');
    f1.add(controls,'radius',10,180);
    f1.add(controls,'speed',0,2);
    var f2 = gui.addFolder('operate');
    f2.add(controls,'addCube');
    f2.add(controls,'removeCube');
    f2.add(controls,'numberOfObjects').listen();
    
    //动态
    renderScene();
    function renderScene(){
        stats.update();
        requestAnimationFrame(renderScene);
        camera.position.x = controls.radius * Math.cos(i%360/180*Math.PI);
        camera.position.z = controls.radius * Math.sin(i%360/180*Math.PI);
        camera.lookAt(scene.position);
        i += controls.speed;
        renderer.render(scene,camera);
    }
    
    //子函数
    function addCube(){
        var cubeSize = Math.ceil(Math.random()*3);
        var cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
        var cubeMaterial = new THREE.MeshPhongMaterial({color:Math.random() * 0xffffff});
        var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube-'+scene.children.length;
        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random()*5));
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
    }
    function rmCube(){
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length-1];
        if(lastObject instanceof THREE.Mesh){
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    }
}

//统计初始化函数
function initStats(){
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append(stats.domElement);
    return stats;
}

function getData(){
    
}