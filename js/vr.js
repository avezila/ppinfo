
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer,raycaster, light, controls, lock;
var mouse = new THREE.Vector2(), INTERSECTED;

var hoversEnabled = true;

var prevObject;

var rot = false;

var megaGroup = new THREE.Group();
var productGroup = new THREE.Group();

var mouse3D = new THREE.Vector3( 0, 0, 0);

var scrollable = false;
var clicksEnabled = true;
var dragable = true;

var options = {
    colors:{
        layer1:'333333',
        layer2:'FF4996',
        layer3:'FE7376',
        layer4:'FF9C58',
        layer5:'42B7B0'
    },
    productColors:[
        'FF2208',
        'F30079',
        'FFCA2D',
        '008C53',
        '42B7B0'
    ]
}

var tex = [];

var interactions = [];

var bar = 0;
var barwidth = 250;
var assets_loaded = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var fio = {
    sponsors:[
        'Галактионова Инесса',
        'Горбунов Александр',
        'Мишин Игорь ',
        'Николаев Вячеслав',
        'Сандлер Аркадий',
        'Филатов Илья',
        'Халин дмитрий'
    ],
    bo:[
        'Елена Мельникова',
        'Зиборова Ольга',
        'Максим Лаптев',
        'Нечай Елена'
    ],
    cpo:[
        'Бородин Гордей',
        'Игорь Косолап',
        'Марасанов Максим',
        'Моисеев Марк',
        'Илья Нестор',
        'Максим Зубарев'
    ],
    po:[
        'Лапина',
        'Макарова',
        'Романчикова',
        'Сергеев',
        'Волков',
        'Житов'
    ]
}

init();

function init() {

    camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 5000 );

    renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth-20, window.innerHeight );
    renderer.setClearColor( 0x000000, 0 );
    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x32005f, 500, 950 );
    // scene.add(fog);

    $("body").append( renderer.domElement );    
    
    camera.position.set(0, 50, 150);
    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.update();
    
    THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {

        bar = Math.floor( barwidth * loaded / total );
        $("#bar").css("width", ""+bar+"px");
        if (loaded/total == 1) {
            $('#progressbar').fadeOut('300');
            $( "#progress" ).fadeOut('300');
            $(".loader2").fadeOut("slow");
            animate();
            startAnimation();
        }
    };
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            //var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    var objLoader = new THREE.OBJLoader();

    megaGroup.position.z = -100;
    megaGroup.position.y = 20;
    megaGroup.rotation.x = Math.PI/180*5;
    scene.add(megaGroup);

    productGroup.position.z = -250;
    productGroup.position.y = -50;
    productGroup.rotation.x = Math.PI/180*20;
    scene.add(productGroup);

    var geometry = new THREE.SphereGeometry( 2, 8, 8 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    lock = new THREE.Mesh( geometry, material );
    // lock.position.y = 850;
    lock.visible = false;
    megaGroup.add( lock );

    objLoader.load('mdl/little_box6.obj', function(object3d){
        
        var counter = 1;        
        for (var i=0;i<7;i++){

            tex[i] = new THREE.TextureLoader().load( 'tex/1-'+counter+'.jpg' );
            createSponsor(i, object3d, counter, tex[i]);
            counter++;

        }

        var counter = 1;
        for (var i=0;i<4;i++){

            tex[i] = new THREE.TextureLoader().load( 'tex/2-'+counter+'.jpg' );
            createBO(i, object3d, counter, tex[i]);
            counter++;

        }

        var counter = 1;
        for (var i=0;i<6;i++){

            tex[i] = new THREE.TextureLoader().load( 'tex/3-'+counter+'.jpg' );
            createCPO(i, object3d, counter, tex[i]);
            counter++;

        }

        var counter = 1;
        for (var i=0;i<6;i++){

            tex[i] = new THREE.TextureLoader().load( 'tex/4-'+counter+'.jpg' );
            createPO(i, object3d, counter, tex[i]);
            counter++;

        }

        var counter = 1;
        for (var i=0;i<2;i++){
            for (var j=0;j<2;j++){
                var little_box = object3d.clone();

                // var rndColor = '0x'+options.colors.layer5;
                if ((i==0)&&(j==0)){
                    var rndColor = '0x'+options.productColors[0];
                } else {
                    var rndColor = '0x'+options.productColors[Math.round(Math.random()*4)];
                }
                little_box.name=counter;
                // little_box.scale.set(5,5,5)
                little_box.position.set(i*30-15, -100, j*50-20);
                little_box.rotation.x = Math.PI/180*20;
                little_box.type = 'container-product';
                little_box.children[0].material = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.2} );
                little_box.children[0].material.color.setHex(rndColor);
                little_box.children[1].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
                little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
                little_box.children[3].material = new THREE.MeshPhongMaterial( {} );
                little_box.children[4].material = new THREE.MeshPhongMaterial( {} );
                little_box.children[5].material = new THREE.MeshPhongMaterial( {} );
                // little_box.children[5].scale.set(2,1,2);
                little_box.children[3].material.color.setHex(rndColor);
                little_box.children[4].material.color.setHex(rndColor);
                little_box.children[5].material.color.setHex(rndColor);
                counter++;
                productGroup.add(little_box);

                if ((i==0)&&(j==0)){
                    var texture = new THREE.TextureLoader().load( 'tex/phone-512.png' );
                    little_box.children[2].material.map = texture;
                    little_box.children[2].material.color.setHex(0xffffff);

                    var geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
                    var material = new THREE.MeshBasicMaterial( {} );
                    sphere1 = new THREE.Mesh( geometry, material );
                    sphere1.material.color.setHex('0x'+options.productColors[0]);
                    sphere1.position.x = 5;
                    little_box.add( sphere1 );

                    var material = new THREE.MeshBasicMaterial( {} );
                    sphere2 = new THREE.Mesh( geometry, material );
                    sphere2.material.color.setHex('0x'+options.productColors[1]);
                    sphere2.position.x = -5;
                    little_box.add( sphere2 );

                    var material = new THREE.MeshBasicMaterial( {} );
                    sphere3 = new THREE.Mesh( geometry, material );
                    sphere3.material.color.setHex('0x'+options.productColors[2]);
                    sphere3.position.z = -5;
                    little_box.add( sphere3 );

                    var material = new THREE.MeshBasicMaterial( {} );
                    sphere4 = new THREE.Mesh( geometry, material );
                    sphere4.material.color.setHex('0x'+options.productColors[3]);
                    sphere4.position.z = 5;
                    little_box.add( sphere4 );
                    little_box.children[2].name = 'Приложение "Мой МТС"';
                }

                if ((i==0)&&(j==1)){
                    var texture = new THREE.TextureLoader().load( 'tex/p-1.jpg' );
                    little_box.children[2].material.map = texture;
                    little_box.children[2].material.color.setHex(0xffffff);
                    little_box.children[2].name = 'Антивирус сетевая услуга';
                }
                if ((i==1)&&(j==0)){
                    var texture = new THREE.TextureLoader().load( 'tex/p-2.jpg' );
                    little_box.children[2].material.map = texture;
                    little_box.children[2].material.color.setHex(0xffffff);
                    little_box.children[2].name = 'Kaspersky Security для МТС';
                }
                if ((i==1)&&(j==1)){
                    var texture = new THREE.TextureLoader().load( 'tex/p-3.jpg' );
                    little_box.children[2].material.map = texture;
                    little_box.children[2].material.color.setHex(0xffffff);
                    little_box.children[2].name = 'МТС - Кто звонит - приложение';
                }

                little_box.children[2].type = 'product';
        
                interactions.push(little_box.children[2]);
            }
        }

    });

    function createSponsor(i, obj, counter, tex){
        var little_box = obj.clone();
        little_box.rotation.x = Math.PI/2;
        little_box.rotation.z = Math.PI;
        // little_box.position.y = -50;
        var color = '0x'+options.colors.layer1;
        little_box.scale.set(1,0.5,1);
        // little_box.scale.set(5,5,5)
        little_box.position.set(i*20-60, -60, 0);

        little_box.name='container-1-'+counter;
        little_box.children[2].fio = fio.sponsors[i];

        little_box.children[0].material = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.6} );
        little_box.children[0].material.color.setHex(color);
        // little_box.children[0].position.y =2;
        little_box.children[1].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );

        // little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
        little_box.children[2].position.y =2;
        little_box.children[3].material = new THREE.MeshPhongMaterial( );
        little_box.children[3].material.color.setHex(color);
        little_box.children[4].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[5].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        // little_box.children[5].scale.set(2,1,2);
        little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
        little_box.children[2].material.map = tex;
        little_box.children[4].material.color.setHex(0x444444);
        little_box.children[5].material.color.setHex(0x444444);
        little_box.children[5].scale.set(1.01,1,1.01);
        little_box.children[5].position.y = 2;

        little_box.children[2].name='1-'+counter;
        little_box.children[2].type = 'sponsor';

        interactions.push(little_box.children[2])

        megaGroup.add(little_box);
    }

    function createBO(i, obj, counter, tex){
        var little_box = obj.clone();
        little_box.rotation.x = Math.PI/2;
        little_box.rotation.z = Math.PI;
        // little_box.position.y = -50;
        var color = '0x'+options.colors.layer2;
        little_box.scale.set(1,0.5,1);
        // little_box.scale.set(5,5,5)
        little_box.position.set(i*20-30, -60, 0);

        little_box.name='container-2-'+counter;
        little_box.children[2].fio = fio.bo[i];

        little_box.children[0].material = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.6} );
        little_box.children[0].material.color.setHex(color);
        // little_box.children[0].position.y =2;
        little_box.children[1].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );

        // little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
        little_box.children[2].position.y =2;
        little_box.children[3].material = new THREE.MeshPhongMaterial(  );
        little_box.children[3].material.color.setHex(color);
        little_box.children[4].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[5].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        // little_box.children[5].scale.set(2,1,2);
        little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
        little_box.children[2].material.map = tex;
        little_box.children[4].material.color.setHex(0x444444);
        little_box.children[5].material.color.setHex(0x444444);
        little_box.children[5].scale.set(1.01,1,1.01);
        little_box.children[5].position.y = 2;

        little_box.children[2].name='2-'+counter;
        little_box.children[2].type = 'bo';

        interactions.push(little_box.children[2])

        megaGroup.add(little_box);
    }

    function createCPO(i, obj, counter, tex){
        var little_box = obj.clone();
        little_box.rotation.x = Math.PI/2;
        little_box.rotation.z = Math.PI;
        // little_box.position.y = -50;
        var color = '0x'+options.colors.layer3;
        little_box.scale.set(1,0.5,1);
        // little_box.scale.set(5,5,5)
        little_box.position.set(i*20-50, -60, 0);

        little_box.name='container-3-'+counter;
        little_box.children[2].fio = fio.cpo[i];

        little_box.children[0].material = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.6} );
        little_box.children[0].material.color.setHex(color);
        // little_box.children[0].position.y =2;
        little_box.children[1].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );

        // little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
        little_box.children[2].position.y =2;
        little_box.children[3].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[3].material.color.setHex(color);
        little_box.children[4].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[5].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        // little_box.children[5].scale.set(2,1,2);
        little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
        little_box.children[2].material.map = tex;
        little_box.children[4].material.color.setHex(0x444444);
        little_box.children[5].material.color.setHex(0x444444);
        little_box.children[5].scale.set(1.01,1,1.01);
        little_box.children[5].position.y = 2;

        little_box.children[2].name='3-'+counter;
        little_box.children[2].type = 'cpo';

        interactions.push(little_box.children[2])

        megaGroup.add(little_box);
    }

    function createPO(i, obj, counter, tex){
        var little_box = obj.clone();
        little_box.rotation.x = Math.PI/2;
        little_box.rotation.z = Math.PI;
        // little_box.position.y = -50;
        var color = '0x'+options.colors.layer4;
        little_box.scale.set(1,0.5,1);
        // little_box.scale.set(5,5,5)
        little_box.position.set(i*20-50, -60, 0);

        little_box.name='container-4-'+counter;
        little_box.children[2].fio = fio.po[i];

        little_box.children[0].material = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.6} );
        little_box.children[0].material.color.setHex(color);
        // little_box.children[0].position.y =2;
        little_box.children[1].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );

        // little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.DoubleSide, transparent: true} );
        little_box.children[2].position.y =2;
        little_box.children[3].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[3].material.color.setHex(color);
        little_box.children[4].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        little_box.children[5].material = new THREE.MeshPhongMaterial( {color: 0x000000} );
        // little_box.children[5].scale.set(2,1,2);
        little_box.children[2].material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
        little_box.children[2].material.map = tex;
        little_box.children[4].material.color.setHex(0x444444);
        little_box.children[5].material.color.setHex(0x444444);
        little_box.children[5].scale.set(1.01,1,1.01);
        little_box.children[5].position.y = 2;

        little_box.children[2].name='4-'+counter;
        little_box.children[2].type = 'po';

        interactions.push(little_box.children[2])

        megaGroup.add(little_box);
    }

    raycaster = new THREE.Raycaster();
    
    lightSystem = new THREE.Group();
    scene.add(lightSystem);

    var light4 = new THREE.AmbientLight( 0xffffff, 0.7 ); // soft light
    scene.add( light4 );

    // var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    // directionalLight.position.set(50,300,-200);
    // lightSystem.add( directionalLight );

    // var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );

    // scene.add( helper );
    
    var light = new THREE.PointLight( 0xFFFFFF, 1, 2000 );
    light.position.set( -300, 500, -100 );
    // var sphereSize = 10;
    // var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    // scene.add( pointLightHelper );

    var light2 = new THREE.PointLight( 0xFFFFFF, 1.5, 2000 );
    light2.position.set( -800, 600, 600 );
    
    lightSystem.add(light);
    lightSystem.add(light2);

    currentInteractions = interactions;
    
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    animate();

}
function onDocumentMouseDown(e) {
    // console.log('mouse pressed');
    if (clicksEnabled){
        if (INTERSECTED) {

            if (INTERSECTED.name == '1-4') {

                var objSpecial = scene.getObjectByName('container-1-4');
                objSpecial.children[5].material.color.setHex(0xff4444);
                
                for ( var i=1;i<8;i++ ) {
                    var obj = scene.getObjectByName('container-1-'+i);
                    var delay = Math.random()*200;
                    moveZ(obj,delay, objSpecial, -350);
                    moveY(obj,delay, Math.PI, objSpecial, 90);
                }

                for ( var i=1;i<5;i++ ) {
                    var obj = scene.getObjectByName('container-2-'+i);
                    var delay = i*100;
                    moveY(obj,delay, 0, NaN, 10);
                }
                
                $('.bheader').fadeOut(300);
                $('.hero2').fadeOut(300);

            }
            if (INTERSECTED.name == '2-3') {

                var objSpecial = scene.getObjectByName('container-2-3');
                objSpecial.children[5].material.color.setHex(0xff4444);
                for ( var i=1;i<5;i++ ) {
                    var obj = scene.getObjectByName('container-2-'+i);
                    var delay = Math.random()*200;
                    moveZ(obj,delay, objSpecial, -350);
                    moveY(obj,delay, Math.PI, objSpecial, 70);
                }

                for ( var i=1;i<7;i++ ) {
                    var obj = scene.getObjectByName('container-3-'+i);
                    var delay = i*100;
                    moveY(obj,delay, 0, NaN, 10);
                }

            }
            if (INTERSECTED.name == '3-5') {
                var objSpecial = scene.getObjectByName('container-3-5');
                objSpecial.children[5].material.color.setHex(0xff4444);

                for ( var i=1;i<7;i++ ) {
                    var obj = scene.getObjectByName('container-3-'+i);
                    var delay = Math.random()*200;
                    moveZ(obj,delay, objSpecial, -350);
                    moveY(obj,delay, Math.PI, objSpecial, 50);
                }

                for ( var i=1;i<7;i++ ) {
                    var obj = scene.getObjectByName('container-4-'+i);
                    var delay = i*100;
                    moveY(obj,delay, 0, NaN, 10);
                }

            }
            if (INTERSECTED.name == '4-2') {
                var objSpecial = scene.getObjectByName('container-4-2');
                objSpecial.children[5].material.color.setHex(0xff4444);

                for ( var i=1;i<7;i++ ) {
                    var obj = scene.getObjectByName('container-4-'+i);
                    var delay = Math.random()*200;
                    moveZ(obj,delay, objSpecial, -350);
                    moveY(obj,delay, Math.PI, objSpecial, 30);
                }

                var cpA = { z: megaGroup.position.z, y: megaGroup.position.y, y2: productGroup.position.y };
                var tpA = { z: -300, y: 40, y2: 60};
                var tween = new TWEEN.Tween(cpA).to(tpA, 1200);
                tween.easing(TWEEN.Easing.Quartic.Out);
                tween.onUpdate(function () {
                    megaGroup.position.z = cpA.z;
                    megaGroup.position.y = cpA.y;
                    productGroup.position.y = cpA.y2;
                });
                tween.onComplete(function () {
                    $('.popup').css('margin-top','120px');
                    for (var i=0;i<productGroup.children.length;i++){
                        // console.log(box6.children[i].type)
                        if (productGroup.children[i].type == 'container-product'){
                            var delay = i*50;
                            goUp(productGroup.children[i],delay);
                        }
                    }
                });
                tween.start();

            }

            if (INTERSECTED.name == 'Приложение "Мой МТС"') {
                var obj = scene.getObjectByName('Приложение "Мой МТС"').parent;

                hoversEnabled = false;
                clicksEnabled = false;

                $('.popup').fadeOut(300);
                $('html,body').css('cursor', 'default');


                var cpA = { x: obj.position.x, y: obj.position.y, z: obj.position.z, r: obj.rotation.x, n: 500, f: 950 };
                var tpA = { x: -40, y: 70, z: 200, r: Math.PI/180*75, n: 200, f: 200};
                var tween = new TWEEN.Tween(cpA).to(tpA, 1200);
                tween.easing(TWEEN.Easing.Quartic.Out);
                tween.onUpdate(function () {
                    obj.position.x = cpA.x;
                    obj.position.y = cpA.y;
                    obj.position.z = cpA.z;
                    obj.rotation.x = cpA.r;
                    scene.fog.near = cpA.n;
                    scene.fog.far = cpA.f;
                });
                tween.onComplete(function () {
                    $('.product').fadeIn(600);

                });
                tween.start();

            }

            if (INTERSECTED.type == 'product') {


            }
            
        }
    }

}
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function checkIntersections(){	
    // find intersections
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactions );
    // console.log(intersects.length)
    if (hoversEnabled){
        if ( intersects.length > 0 ) {
            // console.log(INTERSECTED)
            if ( INTERSECTED != intersects[ 0 ].object ) {
                if (prevObject){

                }
                INTERSECTED = intersects[ 0 ].object;
                if (INTERSECTED.type=='sponsor'){

                    lock.position.x = INTERSECTED.parent.position.x;
                    lock.position.y = INTERSECTED.parent.position.y;
                    lock.position.z = INTERSECTED.parent.position.z;

                    $('.popup').css('display','block');
                    $('.popup').html('<div class="cont"><div class="actual"><div class="header">'+INTERSECTED.fio+'</div><div class="type">Sponsor</div></div></div>');
                    $('html,body').css('cursor', 'pointer');

                }
                if (INTERSECTED.type=='bo'){

                    lock.position.x = INTERSECTED.parent.position.x;
                    lock.position.y = INTERSECTED.parent.position.y;
                    lock.position.z = INTERSECTED.parent.position.z;

                    $('.popup').css('display','block');
                    $('.popup').html('<div class="cont"><div class="actual"><div class="header">'+INTERSECTED.fio+'</div><div class="type">Business owner</div></div></div>');
                    $('html,body').css('cursor', 'pointer');

                }
                if (INTERSECTED.type=='cpo'){

                    lock.position.x = INTERSECTED.parent.position.x;
                    lock.position.y = INTERSECTED.parent.position.y;
                    lock.position.z = INTERSECTED.parent.position.z;

                    $('.popup').css('display','block');
                    $('.popup').html('<div class="cont"><div class="actual"><div class="header">'+INTERSECTED.fio+'</div><div class="type">Chief product owner</div></div></div>');
                    $('html,body').css('cursor', 'pointer');

                }
                if (INTERSECTED.type=='po'){

                    lock.position.x = INTERSECTED.parent.position.x;
                    lock.position.y = INTERSECTED.parent.position.y;
                    lock.position.z = INTERSECTED.parent.position.z;

                    $('.popup').css('display','block');
                    $('.popup').html('<div class="cont"><div class="actual"><div class="header">'+INTERSECTED.fio+'</div><div class="type">Product owner</div></div></div>');
                    $('html,body').css('cursor', 'pointer');

                }

                if (INTERSECTED.type=='product'){

                    lock.position.x = INTERSECTED.parent.position.x;
                    lock.position.y = INTERSECTED.parent.position.y;
                    lock.position.z = INTERSECTED.parent.position.z;

                    $('.popup').css('display','block');
                    $('.popup').html('<div class="cont"><div class="actual"><div class="header">'+INTERSECTED.name+'</div><div class="type">Product</div></div></div>');
                    $('html,body').css('cursor', 'pointer');

                }

            }
        } else {

            if (prevObject){


            }

            INTERSECTED = null;			
            
            $('.popup').css('display','none');
            $('html,body').css('cursor', 'default');

        }
    }
}

function startAnimation() {
    
    for ( var i=1;i<8;i++ ) {
        var obj = scene.getObjectByName('container-1-'+i);
        var delay = i*100;
        moveY(obj,delay, 0, NaN, 10);
    }


}
function moveY(obj, delay, rotation, objSkip, destinationY) {
    if ( obj !== objSkip ){
        var cpA = { y: obj.position.y, r: obj.rotation.z };
        var tpA = { y: destinationY, r: rotation };
        var tween = new TWEEN.Tween(cpA).to(tpA, 1000);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(function () {
            obj.position.y = cpA.y;
            obj.rotation.z = cpA.r;
        });
        tween.delay(delay);
        tween.start();
    } else {
        var cpA = { y: obj.position.y, r: obj.rotation.z };
        var tpA = { y: destinationY, r: 0 };
        var tween = new TWEEN.Tween(cpA).to(tpA, 1000);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(function () {
            obj.position.y = cpA.y;
            obj.rotation.z = cpA.r;
        });
        tween.delay(delay);
        tween.start();
    }
}
function moveZ(obj, delay, objSpecial, destinationZ) {
    if ( obj !== objSpecial ){
        var cpA = { z: obj.position.z, r: obj.rotation.z, o:1 };
        var tpA = { z: destinationZ, r: 0, o: 0.4 };
        var tween = new TWEEN.Tween(cpA).to(tpA, 1000);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(function () {
            obj.position.z = cpA.z;
            obj.rotation.z = cpA.r;
        });
        tween.delay(delay);
        tween.start();
    } else {
        var cpA = { z: obj.position.z, r: obj.rotation.z, o:1 };
        var tpA = { z: destinationZ+20, r: 0, o: 0.4 };
        var tween = new TWEEN.Tween(cpA).to(tpA, 1000);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(function () {
            obj.position.z = cpA.z;
            obj.rotation.z = cpA.r;
        });
        tween.delay(delay);
        tween.start();
    }
}
function goUp(mesh,delay){

    var cpA3 = { y: mesh.position.y };
    var tpA3 = { y: -30 };
    var tween3 = new TWEEN.Tween(cpA3).to(tpA3, 1200);
    tween3.easing(TWEEN.Easing.Quartic.Out);
    tween3.onUpdate(function () {
        mesh.position.y = cpA3.y
    });
    tween3.delay(delay);
    tween3.start();
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth-20, window.innerHeight );

}
function updateStickyDiv() {

    var pos = new THREE.Vector3();
    pos = pos.setFromMatrixPosition(lock.matrixWorld);
    pos.project(camera);
    
    var widthHalf = window.innerWidth / 2;
    var heightHalf = window.innerHeight / 2;
    
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;
    pos.z = 0;

    $('.popup').css('left',pos.x+'px');
    $('.popup').css('top',pos.y+'px');

}
function animate() {

    requestAnimationFrame( animate );
    TWEEN.update();
    checkIntersections();		
    updateStickyDiv();
    render();

    if (rot){
        var obj = scene.getObjectByName('Приложение "Мой МТС"').parent;
        obj.rotation.y +=0.001;
    }

}

function render() {

    renderer.render( scene, camera );

}

$(".logo").click(function() {
    console.log('morph');
    morphTrigger = 1;

});

$(".add").click(function() {
    $('.add').fadeOut(300);

    var obj = scene.getObjectByName('Приложение "Мой МТС"').parent;

    var cpA = { x: obj.position.x, y: obj.position.y, z: obj.position.z, r: obj.rotation.x, xI: 5 };
    var tpA = { x: -12, y: 92, z: 280, r: -Math.PI/180*10, xI: -18 };
    var tween3 = new TWEEN.Tween(cpA).to(tpA, 1200);
    tween3.easing(TWEEN.Easing.Quartic.Out);
    tween3.onUpdate(function () {
        obj.position.x = cpA.x;
        obj.position.y = cpA.y;
        obj.position.z = cpA.z;
        obj.rotation.x = cpA.r;
        $('.pcontainer').css('right', cpA.xI+'%');
    });
    tween3.start();
    tween3.onComplete(function () {        
        rot = true;
    });

});

// $('html').bind('mousewheel', function(e){
//     if (scrollable){
//         if( e.originalEvent.wheelDelta /120 > 0 ) {
//             console.log('mouse plus')
//             if (camera.position.z>700){
//                 // boxGroup.position.z += 20;
//                 // boxGroup.position.y += 7;
//                 // boxGroup.position.x += 2;
//                 camera.position.z += -20;
//             }
//         } else {
//             console.log('mouse minus')
//             if (camera.position.z<1450){
//                 // boxGroup.position.z += -20;
//                 // boxGroup.position.y += -7;
//                 // boxGroup.position.x += -2;
//                 camera.position.z += 20;
//             }
//         }
//     }
// });
