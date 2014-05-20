$(function() {
    $("#map-container").css("overflow","scroll");
    
    var width = 1800,
        height = 1360;
    var sc = 1500,
        p_x = 1236,
        p_y = 1175;
    
    var renderer, stats;
    var scene, camera, group;
    var windowHalfX = window.innerWidth/2;
    var windowHalfY = window.innerHeight/2;
    
    init_map();

    function init_map(){
        getGeoJSON("chinese.json",processD3Geo);
        getGeoJSON("chinese.json",processThreejsGeo);
    }

    function getGeoJSON(name,callback){
        d3.json("/data/geo/"+name,callback);
    }

    function processD3Geo(err,chn){
        var features = topojson.feature(chn,chn.objects.CHN_adm1).features;
        if (err) return console.log(err);

        var projection = d3.geo.mercator()
            .scale(sc)
            .translate([p_x-2.076*sc,p_y+0.355*sc])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection)
            .pointRadius(2);
        var svg = d3.select("#map-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        var color_fill = d3.scale.linear()
            .domain([0,255])
            .range(["#fff","#00f"])

        //临时数据接口
        var test_array = [];
        for(var i=0;i<32;i++)
            test_array[i] = Math.floor(Math.random()*255);


        var subunit = svg.selectAll(".city")
            .data(features)
            .enter().append("g")
            .attr("id",function(d){return "city"+d.id})
            .attr("class","city")
            .style({"fill":function(d){ return color_fill(test_array[d.id-1])}})

        subunit.append("path")
            .attr("d", path);
    }

    function processThreejsGeo(err,chn){
        var features = topojson.feature(chn,chn.objects.CHN_adm1).features;
        var mapGeoList = [];
        if(err) return console.log(err);
        features.map(function(obj){
            var eachMap = {};
            eachMap.id = obj.id;
            eachMap.coordinates = obj.geometry.coordinates;
            mapGeoList.push(eachMap);
        });
        init_threejs();
    }
    
    function init_threejs(){
        
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xb0b0b0);
        renderer.setSize(window.innerWidth-40,window.innerHeight);
        
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
        camera.position.set(0,0,200);
        
        group = new THREE.Object3D();
        group.position.x = 0;
        group.position.y = 0;
        group.position.z = 0;
        scene.add(group);
        
        var light = new THREE.DirectionalLight(0x404040);
        light.position.set(0.75,0.75,1.0).normalize();
        scene.add(light);
        
        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(160,160,20,20),
            new THREE.MeshBasicMaterial({color:0x7f7f7f,wireframe:true}));
        plane.rotation.x = Math.PI;
        group.add(plane);
        
        $("#map-3d-container").append(renderer.domElement);
    }
});
