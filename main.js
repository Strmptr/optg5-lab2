// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;
var planets = []; 
var planetName = [];
var planetInfo = [];
var sputnicName = [];

var sputnics = [];
var f = null;
var xx=0;
var zz=0;
var keyboard = new THREEx.KeyboardState();
var earthcloud= createEarthCloud();
var v=0;
var l=0;
var a=0;
var b=0;
var rezhim_slezheniya = 1;
var clock = new THREE.Clock();
// Создание загрузчика текстур
var loader = new THREE.TextureLoader();
// Функция инициализации камеры, отрисовщика, объектов сцены и т.д.
init();
onWindowResize();
// Обновление данных по таймеру браузера
animate();


function init()
{
    // Получение ссылки на элемент html страницы
    container = document.getElementById( 'container' );
    // Создание "сцены"
    scene = new THREE.Scene();
    // Установка параметров камеры
    // 45 - угол обзора
    // window.innerWidth / window.innerHeight - соотношение сторон
    // 1 - 4000 - ближняя и дальняя плоскости отсечения
    camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 1, 4000 );
    // Установка позиции камеры
    camera.position.set(0, 20, 80);
    var spotlight = new THREE.PointLight(0xffffff);
    var width = window.innerWidth;
    var height = window.innerHeight;
    //установка позиции источника освещения
    spotlight.position.set(0, 0, 0);
    //добавление источника в сцену
    scene.add(spotlight);

    // Установка точки, на которую камера будет смотреть
    camera.lookAt(new THREE.Vector3( 0, 0.0, 0));
    
    cameraOrtho = new THREE.OrthographicCamera( -width / 2, width / 2, height / 2, -height / 2, 1, 10 );
    cameraOrtho.position.z = 10;
    
    sceneOrtho = new THREE.Scene();
    // Создание отрисовщика
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // Закрашивание экрана синим цветом, заданным в 16ричной системе
    renderer.setClearColor( 0xffffff, 1);
    container.appendChild( renderer.domElement );
    // Добавление функции обработки события изменения размеров окна
    window.addEventListener( 'resize', onWindowResize, false );
    renderer.autoClear = false;
    var light = new THREE.AmbientLight( 0x181818 ); // soft white light  постоянная подсветка всех эл-ов
    scene.add( light );

    addSun();
    addStar();
    addPlanet(0.38*2,20,"pics/mercurymap.jpg","pics/mercurybump.jpg",1.2,MoonLoader(0.00001,"pics/moonmap1k.jpg",20,2,1.2/2,0),null);
    addPlanet(0.95*2,25,"pics/venusmap.jpg","pics/venusbump.jpg",1.0,MoonLoader(0.00001,"pics/moonmap1k.jpg",25,3,1/2,0),null);
    addPlanet(1*2,32,"pics/earthmap1k.jpg","pics/earthbump1k.jpg",0.8,MoonLoader(1,"pics/moonmap1k.jpg",32,5,0.8/2,0)
    ,null);
    addPlanet(0.53*2,40,"pics/marsmap1k.jpg","pics/marsbump1k.jpg",0.5,MoonLoader(0.00001,"pics/moonmap1k.jpg",40,5,0.5/2,0),null);
    addLine();
    scene.add(earthcloud);

    InformationAboutThePlanets('sprites/mercuryl.png'  );
    InformationAboutThePlanets('sprites/venusl.png'  );
    InformationAboutThePlanets('sprites/earthl.png'  );
    InformationAboutThePlanets('sprites/marsl.png'  );

    addSprite( 'sprites/mercury.png' );
    addSprite( 'sprites/venus.png' );
    addSprite( 'sprites/earth.png' );
    addSprite( 'sprites/mars.png' );
   


}
function onWindowResize()
{
    // Изменение соотношения сторон для виртуальной камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Изменение соотношения сторон рендера
    renderer.setSize( window.innerWidth, window.innerHeight );
}
// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
    requestAnimationFrame( animate );
    render();
    a += 0.01;
    b += 0.01;
    var delta = clock.getDelta();
    for (var i = 0; i < planets.length; i++) 
        {
            //создание набора матриц
            var m = new THREE.Matrix4();
            var m1 = new THREE.Matrix4();
            var m2 = new THREE.Matrix4();
            ///создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2
            planets[i].a1 += planets[i].v1 * delta;
            //sputnics[i].a1 += sputnics[i].v1 * delta;
            m1.makeRotationY( planets[i].a1 );
            m2.setPosition(new THREE.Vector3(planets[i].posX, 0, 0));
           // m111111.setPosition(new THREE.Vector3(planets[2].posX,0,planets[2].posZ));
            //запись результата перемножения m1 и m2 в m
            //moon.multiplyMatrices (m1,m3);
            m.multiplyMatrices( m1, m2 );
          
            m.multiplyMatrices( m, m1 );
            
            planets[i].sphere.matrix = m;

            planets[i].sphere.matrixAutoUpdate = false;
            planets[i].angleaxis += planets[i].speedaxis * delta;
            
            var spriteMatrix = new THREE.Matrix4();
            spriteMatrix.copyPosition(planets[i].sphere.matrix);
            var newcoordsSprite = new THREE.Vector3();
            newcoordsSprite.setFromMatrixPosition(spriteMatrix);
            if(i>0 && i<3)
            {
                planetName[i].position.set(newcoordsSprite.x-0.1,newcoordsSprite.y-3,newcoordsSprite.z); 
            }
            else
            planetName[i].position.set(newcoordsSprite.x-0.1,newcoordsSprite.y-2,newcoordsSprite.z);
            /*var cloud = new THREE.Matrix4();
            cloud.copyPosition(planets[2].sphere.matrix);
            var newcoordsCloud = new THREE.Vector3();
            newcoordsCloud.setFromMatrixPosition(cloud); 
            earthcloud.position.set(newcoordsCloud.x,newcoordsCloud.y,newcoordsCloud.z);
            earthcloud.rotation.y = planets[2].a1;
            *///установка m в качестве матрицы преобразований объекта object
            if(planets[i].moon != null)
            {
                //получение позиции из матрицы позиции
                var pos = new THREE.Vector3(0, 0, 0);
                pos.setFromMatrixPosition( planets[i].sphere.matrix);

                
                var m = new THREE.Matrix4();
                var m1 = new THREE.Matrix4();
                
                var m2 = new THREE.Matrix4();
                
                var m3 = new THREE.Matrix4();
                
                var m4 = new THREE.Matrix4();
               
                var m5 = new THREE.Matrix4();
               
                //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2
                m1.makeRotationY( planets[i].moon.angle );
                m2.setPosition(new THREE.Vector3(planets[i].moon.x1, 0, 0));
                m3.makeRotationY( planets[i].moon.angleaxis );
                
                
               
              
               
                m4.setPosition(new THREE.Vector3(planets[i].moon.x2 * Math.cos(-planets[i].moon.angle2+b), 0, planets[i].moon.x2 * Math.sin(-planets[i].moon.angle2+b)));
                m5.makeRotationY(planets[i].moon.angle2);
                //запись результата перемножения m1 и m2 в m
                m.multiplyMatrices( m1, m2 );
                m.multiplyMatrices( m , m3 );
                m.multiplyMatrices( m, m4 );
                m.multiplyMatrices( m, m5 );
                //установка m в качестве матрицы преобразований объекта object
                planets[i].moon.sphere.matrix = m;
                planets[i].moon.sphere.matrixAutoUpdate = false;
                planets[i].moon.angle2 += 1 * delta;
              
                planets[i].moon.angle += planets[i].moon.v1 * delta;
                planets[i].moon.angleaxis += planets[i].moon.a1 * delta;
    
                

            }
            
        }
        
        key();
            if (rezhim_slezheniya==2)
            {    
                if(f==4) 
                {
                    camera.position.set(0, 20, 80);
                    camera.lookAt(new THREE.Vector3( 0, 0.0, 0));
                }
                if(f==0) 
                {
                    var mat = new THREE.Matrix4();
                    mat.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(mat); 
                    camera.position.set(newcoords.x,newcoords.y+5,newcoords.z+10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z)); 
                }
                if(f==1) 
                {            
                    var mat = new THREE.Matrix4();
                    mat.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(mat); 
                    camera.position.set(newcoords.x,newcoords.y+5,newcoords.z+10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z)); 
                }
                /*var x = (planets[j].posX) * Math.cos(i*Math.PI/180);
                var z =(planets[j].posX) * Math.sin(i*Math.PI/180);
                */
                if(f==2) 
                {
                    var mat = new THREE.Matrix4();
                    mat.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(mat); 
                    camera.position.set(newcoords.x,newcoords.y+5,newcoords.z+10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z)); 
                }
                if(f==3) 
                {
                    var mat = new THREE.Matrix4();
                    mat.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(mat); 
                    camera.position.set(newcoords.x,newcoords.y+5,newcoords.z+10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z));            
                }
            }
            else 
            {
                if(f==4) 
                {
                    camera.position.set(0, 20, 80);
                    camera.lookAt(new THREE.Vector3( 0, 0.0, 0));
                      
                    for (var i = 0; i < planetName.length; i++)
                    {     
                        planetName[i].visible = true;                   
                        planetInfo[i].visible = false;
                    }
                }
                if(f==0) 
                {
                    for (var i = 0; i < planetName.length; i++)
                    {     
                        planetName[i].visible = false;                   
                        planetInfo[i].visible = false;
                    }
                    
                    planetInfo[f].visible = true;   
                    var moon1 = new THREE.Matrix4();
                    moon1.copyPosition(planets[f].moon.sphere.matrix);
                    var e1= new THREE.Matrix4();
                    e1.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    var newcoords1 = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(e1); 
                    newcoords1.setFromMatrixPosition(moon1) ;
                    camera.position.set(newcoords1.x-5,newcoords1.y+5,newcoords1.z-5);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z));
                }
                if(f==1) 
                {       
                    for (var i = 0; i < planetName.length; i++)
                    {     
                        planetName[i].visible = false;                   
                        planetInfo[i].visible = false;
                    }
                    
                    planetInfo[f].visible = true;     
                    var moon1 = new THREE.Matrix4();
                    moon1.copyPosition(planets[f].moon.sphere.matrix);
                    var e1= new THREE.Matrix4();
                    e1.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    var newcoords1 = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(e1); 
                    newcoords1.setFromMatrixPosition(moon1) ;
                    camera.position.set(newcoords1.x-10,newcoords1.y+10,newcoords1.z-10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z));
                }
            
                if(f==2) 
                {
                    for (var i = 0; i < planetName.length; i++)
                    {     
                        planetName[i].visible = false;                   
                        planetInfo[i].visible = false;
                    }
            
                    planetInfo[f].visible = true;
                    var moon1 = new THREE.Matrix4();
                    moon1.copyPosition(planets[f].moon.sphere.matrix);
                    var e1= new THREE.Matrix4();
                    e1.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    var newcoords1 = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(e1); 
                    newcoords1.setFromMatrixPosition(moon1) ;
                    camera.position.set(newcoords1.x,newcoords1.y+10,newcoords1.z);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z)); 
                }
                if(f==3) 
                {
                    for (var i = 0; i < planetName.length; i++)
                    {     
                        planetName[i].visible = false;                   
                        planetInfo[i].visible = false;
                    }
                    
                    planetInfo[f].visible = true;
                    var moon1 = new THREE.Matrix4();
                    moon1.copyPosition(planets[f].moon.sphere.matrix);
                    var e1= new THREE.Matrix4();
                    e1.copyPosition(planets[f].sphere.matrix);
                    var newcoords = new THREE.Vector3();
                    var newcoords1 = new THREE.Vector3();
                    newcoords.setFromMatrixPosition(e1); 
                    newcoords1.setFromMatrixPosition(moon1) ;
                    camera.position.set(newcoords1.x-10,newcoords1.y+10,newcoords1.z-10);
                    camera.lookAt(new THREE.Vector3(newcoords.x,0.0,newcoords.z));            
                }
            }
        
    // Добавление функции на вызов, при перерисовки браузером страницы

    var cloud = new THREE.Matrix4();
    cloud.copyPosition(planets[2].sphere.matrix);
    var newcoordsCloud = new THREE.Vector3();
    newcoordsCloud.setFromMatrixPosition(cloud); 
    earthcloud.position.set(newcoordsCloud.x,newcoordsCloud.y,newcoordsCloud.z);
    earthcloud.rotation.y = planets[2].a1;
}

function key()
{

   

    if (keyboard.pressed("0"))
        {
            f=4;
        }
    if (keyboard.pressed("1"))
        {
            f=0;
        }
    if (keyboard.pressed("2"))
        {
            f=1;

        }
    if (keyboard.pressed("3"))
        {
            f=2;
        }
    
    if (keyboard.pressed("4"))
        {
            f=3;
        }        
    if (keyboard.pressed("D")){
            b -= 0.05;
        }
    
     if (keyboard.pressed("A")){
            b += 0.05;
        }   
        
}
function render()
{
    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
}
function addSun()
{
    //создание геометрии сферы
    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    //загрузка текстуры
    var loader = new THREE.TextureLoader();
    //создание материала
    var material = new THREE.MeshBasicMaterial({
    map: loader.load( "pics/sunmap.jpg" ),
    side: THREE.DoubleSide
    });
    //создание объекта
    var sphere = new THREE.Mesh(geometry, material);
    //размещение объекта в сцене
    scene.add( sphere );
}   
function addStar()
    {
    //создание геометрии сферы
    var geometry = new THREE.SphereGeometry( 500, 32, 32 );
    //загрузка текстуры
    var loader = new THREE.TextureLoader();
    //создание материала
    var material = new THREE.MeshBasicMaterial({
    map: loader.load( "pics/starmap.jpg" ),
    side: THREE.DoubleSide
    });
    //создание объекта
    var sphere = new THREE.Mesh(geometry, material);
    //размещение объекта в сцене
    scene.add( sphere );
    } 
    function MoonLoader(r,tpics, x1, x2, v1, a1)
{
    //создание геометрии сферы
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    var loader = new THREE.TextureLoader();
        var material = new THREE.MeshPhongMaterial({
            map:loader.load(tpics),
            side:THREE.DoubleSide
        })  ;
        var sphere = new THREE.Mesh(geometry,material)

    sphere.position.set(x1, 0, 0);
     
    //размещение объекта в сцене
    scene.add( sphere );
    
    var planet = {}; //создание
    planet.sphere = sphere; //добавление поля planet
    planet.x1 = x1;
    planet.x2 = x2;
    planet.v1 = v1;
    planet.a1 = a1;
    planet.angle = 0;
    planet.angle2 = 0;
    planet.angleaxis = 0;
    return planet;
}
function addPlanet(r,posX,tpics,tbump,v1,moon,tlight)
    {
        
        var geometry = new THREE.SphereGeometry( r, 32, 32 );
        //загрузка текстуры
        var loader = new THREE.TextureLoader();
        //создание материала
        var bump = loader.load( tbump );
      //  var specMap = loader.load( tlight ); 
        //назначение карты и цвета бликов
        var material = new THREE.MeshPhongMaterial({
        map: loader.load( tpics ),
        bumpMap: bump,
        bumpScale: 0.09,
      //  specularMap: specMap,
      //  specular: new THREE.Color('grey'),
        side: THREE.DoubleSide
});

        //создание объекта
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = posX;
        //размещение объекта в сцене
        scene.add( sphere );
        //размещение объекта в сцене
        var planet = {};

        //planet.sputnic=sputnic;
        planet.v1 = v1/2;
        planet.a1 = 0.0;
        planet.posX = posX;
        planet.camX = posX+4;
        planet.posZ = 0;
        planet.r=r;
        planet.sphere=sphere;
        planet.moon=moon;
        planets.push(planet); 
        
    }
    function createEarthCloud()
        {
        // create destination canvas
        var canvasResult = document.createElement('canvas');
        canvasResult.width = 1024;
        canvasResult.height = 512;
        var contextResult = canvasResult.getContext('2d');
        // load earthcloudmap
        var imageMap = new Image();
        imageMap.addEventListener("load", function()
        {

        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
        // load earthcloudmaptrans
        var imageTrans = new Image();
        imageTrans.addEventListener("load", function()
        {
        // create dataTrans ImageData for earthcloudmaptrans
        var canvasTrans = document.createElement('canvas');
        canvasTrans.width = imageTrans.width;
        canvasTrans.height = imageTrans.height;
        var contextTrans = canvasTrans.getContext('2d');
        contextTrans.drawImage(imageTrans, 0, 0);
        var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width,
        canvasTrans.height);
        // merge dataMap + dataTrans into dataResult
        var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
        for(var y = 0, offset = 0; y < imageMap.height; y++)
        for(var x = 0; x < imageMap.width; x++, offset += 4)
        {
        dataResult.data[offset+0] = dataMap.data[offset+0];
        dataResult.data[offset+1] = dataMap.data[offset+1];
        dataResult.data[offset+2] = dataMap.data[offset+2];
        dataResult.data[offset+3] = 255-dataTrans.data[offset+0];
        }
        // update texture with result
        contextResult.putImageData(dataResult,0,0)
        material.map.needsUpdate = true;
        });

        imageTrans.src = 'pics/earthcloudmaptrans.jpg';
        }, false);

        imageMap.src = 'pics/earthcloudmap.jpg';
        var geometry = new THREE.SphereGeometry(2.1, 32, 32);
        
        var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        });

        var cloud = new THREE.Mesh(geometry, material);
        return cloud;
            
}
function addLine()
{    
    for (var j = 0; j < planets.length; j++) 
    {               
        var lineGeometry = new THREE.Geometry();
        var vertArray = lineGeometry.vertices;
        for (var i = 0; i<360;i++)
        {                      
            var x = (planets[j].posX) * Math.cos(i*Math.PI/180);
            var z =(planets[j].posX) * Math.sin(i*Math.PI/180);                   
            vertArray.push(new THREE.Vector3(x,0,z));                
        }
        var lineMaterial = new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize:1 } ); //параметры: цвет, размер черты, размер промежутка
        var line = new THREE.Line( lineGeometry, lineMaterial );
        line.computeLineDistances();
        scene.add(line);
    }
}
function InformationAboutThePlanets(name)
{
    var texture = loader.load(name);
    var material = new THREE.SpriteMaterial( {map: texture} );

    var sprite = new THREE.Sprite( material );
    sprite.center.set( 0.0, 1.0 );
    sprite.scale.set( 500, 500, 1 );

    sceneOrtho.add(sprite);
    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;

    sprite.position.set( -width, height, 1 );
    sprite.visible = false;
    
    planetInfo.push( sprite );
}

function addSprite(name)
{
    var texture = loader.load(name);
    var material = new THREE.SpriteMaterial( {map: texture} );

    var sprite = new THREE.Sprite( material );
    sprite.position.set( 30, 0, 0);
    sprite.scale.set(50, 50, 50);
    scene.add( sprite );
    planetName.push( sprite );
   
}

