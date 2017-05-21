  //2.通用函数
    var data = data;
    function get(selector){
        var method = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';
       return document[method](selector.substr(1));
    }

    // 随机生成一个值，支持你取值范围  random([min,max])
    function random(range){
         var max = Math.max(range[0],range[1]);
         var min = Math.min(range[0],range[1]);
         var diff = max - min;                                          //差值[1,6]
         var number = Math.ceil(Math.random()*diff+min);                //取范围内的随机数
         return number;
    }


    //3.输出海报
    function putPhoto(){
        var template =get('#wrap').innerHTML;
        var html = [];
        var btn = [];
        for(var s=0;s<data.length;s++){
        var _html=template
             .replace('{{index}}',s)
             .replace('{{img}}',data[s].img)
             .replace('{{caption}}',data[s].caption)
             .replace('{{desc}}',data[s].desc)
             html.push(_html);
            btn.push('<span id="btn_'+s+'" class="i" onclick="turn(get(\'#photo_'+s+'\'))">&nbsp;</span>');
            
        }
        html.push('<div id="btn" class="btn">'+btn.join('')+'</div>')
       get('#wrap').innerHTML = html.join('');
       rsort(random([0,data.length]));
    }
   putPhoto();

   //5.计算左右分区范围 {left:{x[min,,max],y[]} , right{}}
   function range(){
    var range={left:{x:[],y:[]},right:{x:[],y:[]}};
    var wrap={
      w:get('#wrap').clientWidth,
      h:get('#wrap').clientHeight
    };
    var photo={
      w:get('.photo')[0].clientWidth,
      h:get('.photo')[0].clientHeight
    };
    range.wrap=wrap;
    range.photo=photo;
    // 左分区
    range.left.x=[-photo.w/2,wrap.w/2-photo.w/2];
    range.left.y=[-photo.h/2,wrap.h];
    // 右分区
    range.right.x=[wrap.w/2+photo.w/2,wrap.w-photo.w/2];
    range.right.y=range.left.y;
     return range;
   }

    //4.海报排序
    function  rsort(n){
     var _photo = get('.photo');
     var photos = [];
     for(var s = 0 ;s<_photo.length;s++){
         _photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,'');
          _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,'');
           _photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,'');
          //给初始化一个属性
          _photo[s].className += ' photo_front ';
          //给中间的海报样式设为空，可以垂直居中
         _photo[s].style.left = '';
         _photo[s].style.top = '';
         _photo[s].style['transform']= 'rotate(360deg) scale(1.2)';

          photos.push(_photo[s]); 
     }
    
       var photo_center = get('#photo_'+ n);
       photo_center.className +=' photo_center ';
       photo_center = photos.splice(n,1)[0];


       //把海报分为左右两个区域
       var photos_left=photos.splice(0,Math.ceil(photos.length/2));
       var photos_right = photos;
       var ranges = range();
       //左分区
       for(var s=0;s<photos_left.length;s++){
         var photo = photos_left[s];
         photo.style.left=random(ranges.left.x)+'px';
         photo.style.top=random(ranges.left.y) + 'px';
         photo.style['transform']= 'rotate('+random([-150,150])+'deg) scale(1)';
       
       }
       //右分区
       for(var r=0;r<photos_right.length;r++){
         var photo = photos_right[r];
         photo.style.left = random(ranges.right.x) + 'px';
         photo.style.top = random(ranges.right.y) + 'px';
         photo.style['transform']= 'rotate('+random([-150,150])+'deg) scale(1)';
         
       }
       //按钮控制处理
       var btns = get('.i');
       for( var s = 0;s<btns.length;s++){
            btns[s].className = btns[s].className.replace(/\s*i_current\s*/, '');
            btns[s].className = btns[s].className.replace(/\s*i_back\s*/, '');
       }
      get('#btn_'+n).className += ' i_current ';  
         
    }

    // 1.实现翻转
      function turn(elem){       
        // 获取元素
        var cls = elem.className; 
        var n = elem.id.split('_')[1];
        if(!/photo_center/.test(cls)){
            return rsort(n);
        }
        // 利用正则匹配      
        if(/photo_front/.test(cls)){                   
           cls = cls.replace(/photo_front/,'photo_back');
           get('#btn_'+n).className += ' i_back'
        }else{
            cls = cls.replace(/photo_back/,'photo_front');
              get('#btn_'+n).className +=  get('#btn_'+n).className.replace(/\s*i_back\s*/,'');
        }
        return elem.className = cls;
      }
       
