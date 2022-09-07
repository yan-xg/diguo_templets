//jquery
const baseURL = 'http://192.168.1.16:8009';
//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//获取.html前的文件名
function getHtmlName() {
    var url = window.location.href;
    var index = url.lastIndexOf("/");
    var result = url.substring(index + 1, url.length - 5);
    result = result.match(/\d+/g);
    if(window.Array.isArray(result)){
        return result
    }else{
        return []
    }
}

console.log(window.Array.isArray(getHtmlName()));
//渲染栏目列表
function renderColumn(data) {
    let typeid = 0;
    if(getUrlParam('id')){typeid = getUrlParam('id')};
    $.ajax({
        url: baseURL + '/api/?c=type&a=lists',
        type: 'post',
        data:{
            sign:data.sign,
            reid:0
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = `<li><a href="/">首页</a></li>`;
            data.forEach(item => {
                html += `<li><a href="${baseURL+item.typedir+'/'}" onclick="clickId(${item.id})">${item.typename}</a></li>`;
            });
            $('#starlist').html(html);
        }
    })
}
//点击目录
function clickId(id) {
    localStorage.setItem('typeid',id);
}
//渲染文章列表
function renderArticle(data,current,typeid,pageSize=10) {
    let sign = data.sign;
    $.ajax({
        url: baseURL + '/api/?c=archive&a=lists',
        type: 'post',
        data:{
            sign,
            pageSize,
            current,
            typeid
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list.forEach(item => {
                html += `<li class="blogs_list"> 
                            <a href="${baseURL+item.url}" target="_blank">
                                <i><img src="${baseURL+item.litpic}" alt="机械制造行业未来的前景"></i>
                                <h2>${item.title}</h2>
                            </a>
                            <p>${item.description}</p>
                            <div class="blogs_writer"><span class="blogs_time">${item.created_at}</span></div>
                            <div class="blogs_tags">
                                <a href='${baseURL+item.typedir}' target='_blank'>${item.typename}</a> 
                            </div>
                            <span class="blogs_lm"><a href="${baseURL+item.typedir}" target="_blank">${item.typename}</a></span>
                        </li>`;
            });
            $('#article').html(html);
            if($('#pagelist').length){
                callBackPage(sign,typeid,Number(data.current),Number(data.total),Number(data.pageSize));
            }
        }
    })
}
//渲染热门文章列表
function renderHotArticle(data,offset,pageSize=5) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=hot',
        type: 'post',
        data:{
            sign:data.sign,
            offset,
            pageSize
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list?.forEach((item,index) => {
                html += `<li>
                            <a href="${baseURL+item.url}" title="${item.title}" target="_blank">
                                <i><img src="${baseURL+item.litpic}" alt="机械制造行业未来的前景"></i><em>${index+1}</em>
                                <h2>${item.title}</h2>
                                <span>${item.created_at}</span>
                            </a>
                        </li>`;
            });
            $('#hotarticle').html(html);
        }
    })
}
//渲染文章详情
function renderArticleDetail(data,aid) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=detail',
        type: 'post',
        data:{
            sign:data.sign,
            aid
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let tags = data.keywords.split(',');
            tags.pop();
            let taghtml = '';
            tags.forEach(item => {taghtml += `<a href="/tags/${item}/" target="_blank">${item}</a>`;});
            let html = `<h1>${data.title}</h1>
            <div class="wz_info">
                <span class="wz_frome"><a href="index.html" target="_blank">3D生态网</a></span>
                <span class="wz_time">2020-10-18</span> 
            </div>
            <div class="wz_smalltext">${data.description}</div>
            <div class="content">${data.body}</div>
            <div class="wz_zhuanzai">
              <p>所有文章未经授权禁止转载、摘编、复制或建立镜像，违规转载法律必究。</p>
              <p>举报邮箱：<a href="javascript:;" target="_blank">dacesmiling@qq.com</a></p>
            </div>
            <div class="tags"> 相关标签：${taghtml}</div>        
            <div class="info-pre-next">
                <p>${data.pre}</a></p>
                <p>${data.next}</p>
            </div>  
            <div class="ad"></div>`;
            $('#details').html(html);
            $('#weizhi').html(data.position);
        }
    })
}
//渲染banner
function renderBanner(data,flag='c,p',offset=0,pageSize=10) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=flags',
        type: 'post',
        data:{
            sign:data.sign,
            flag,
            offset,
            pageSize,
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list.forEach((item,index) => {
                html += `<div class="swiper-slide">
                            <a href="javascript:;" target="_blank"><img src="${baseURL +item.litpic}" alt="【阿里云】专属小站折扣价，新用户独享优惠">
                            <section>
                                <h4>${item.title}</h4>
                            </section>
                            </a>
                        </div>`;
            });
            $('#swiper-wrapper').html(html);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                spaceBetween: 100,
                centeredSlides: true,
                autoplay: 8000,
                autoplayDisableOnInteraction: false,
            });
        }
    })
}
//banner推荐
function renderBannerRecommend(data,flag='c,p',offset,pageSize=2) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=flags',
        type: 'post',
        data:{
            sign:data.sign,
            flag,
            offset,
            pageSize,
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list.forEach((item,index) => {
                html += `<li>
                            <a href="${baseURL+item.url}" title="${item.title}">
                                <img src="${baseURL+item.litpic}" alt="${item.title}">
                                <span>
                                    <h4>${item.title}</h4>
                                </span>
                            </a>
                        </li>`;
            });
            $('#headline').html(html);
        }
    })
}
//渲染头条
function renderTop(data,flag='c,p',offset=0,pageSize=10) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=flags',
        type: 'post',
        data:{
            sign:data.sign,
            flag,
            offset,
            pageSize,
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list?.forEach((item,index) => {
                html += `<li><i></i><a href="${baseURL+item.url}" target="_blank">${item.title}</a><span>${item.created_at}</span></li>`;
            });
            $('#newTop').html(html);
        }
    })
}
//渲染标签
function renderTag(data) {
    $.ajax({
        url: baseURL + '/api/?c=tags&a=hot',
        type: 'post',
        data:{
            sign:data.sign,
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.forEach((item,index) => {
                html += `<a href="${baseURL+item.url}" target="_blank">${item.tag}</a>`;
            });
            $('.tag-list').html(html);
        }
    })
}
//渲染标签列表
// function renderTagList(data,tag,current,pageSize=10) {
//     $.ajax({
//         url: baseURL + '/api/?c=tags&a=lists',
//         type: 'post',
//         data:{
//             sign:data.sign,
//             tag,
//             current,
//             pageSize,
//         },
//         success:function(reslist){
//             let {data} = JSON.parse(reslist);
//             let html = '';
//             data.list.forEach(item => {
//                 html += `<li class="blogs_list"> 
//                             <a href="${baseURL+item.url}" target="_blank">
//                                 <i><img src="${baseURL+item.litpic}" alt="机械制造行业未来的前景"></i>
//                                 <h2>${item.title}</h2>
//                             </a>
//                             <p>${item.description}</p>
//                             <div class="blogs_writer"><span class="blogs_time">${item.created_at}</span></div>
//                             <div class="blogs_tags">
//                                 <a href='${baseURL+item.typedir}' target='_blank'>${item.typename}</a> 
//                             </div>
//                             <span class="blogs_lm"><a href="${baseURL+item.typedir}" target="_blank">${item.typename}</a></span>
//                         </li>`;
//             });
//             $('#article').html(html);
//             if($('#pagelist').length){
//                 callBackPage(sign,typeid,Number(data.current),Number(data.total),Number(data.pageSize));
//             }
//         }
//     })
// }
//推荐阅读
function renderRecommend(data,flag='c,p',offset=0,pageSize=4) {
    $.ajax({
        url: baseURL + '/api/?c=archive&a=flags',
        type: 'post',
        data:{
            sign:data.sign,
            flag,
            offset,
            pageSize,
        },
        success:function(reslist){
            let {data} = JSON.parse(reslist);
            let html = '';
            data.list?.forEach((item,index) => {
                html += `<li>
                            <a href="${baseURL+item.url}" target="_blank">
                            <i><img src="${baseURL+item.litpic}" alt="机械制造行业未来的前景"></i>
                            <h2>${item.title}</h2>
                            <span>${item.created_at}</span>
                            </a>
                        </li>`;
            });
            $('#recommend').html(html);
        }
    })
}
//分页
function callBackPage(sign,typeid,curr,total,pageSize) {
    let html = `<li><a href='list_${typeid}_1.html'>首页</a></li>`;
    let page = Math.ceil(total/pageSize);
    let current = getHtmlName()[getHtmlName().length-1]*1;
    if(!current){current = 1;}
    if(page < 6){
        for(var i = 0;i<page;i++){
            html += `<li class="${current==i+1?'thisclass':''}"><a href='list_${typeid}_${i+1}.html'>${i+1}</a></li>`;
        }
    }else{
        //当总页数大于6页时，显示当前页前后各两页,共显示5页
        if(current<=3){
            for(var i = 0;i<5;i++){
                html += `<li class="${current==i+1?'thisclass':''}"><a href='list_${typeid}_${i+1}.html'>${i+1}</a></li>`;
            }
        }else if(current>=page-2){
            for(var i = page-4;i<page;i++){
                html += `<li class="${current==i+1?'thisclass':''}"><a href='list_${typeid}_${i+1}.html'>${i+1}</a></li>`;
            }
        }else{
            for(var i = current-2;i<current+3;i++){
                html += `<li class="${current==i+1?'thisclass':''}"><a href='list_${typeid}_${i+1}.html'>${i+1}</a></li>`;
            }
        }
    }
    html +=`<li><a href='javascript#'>共${page}页/${total}条</a></li>`;
    $('#pagelist').html(html);
}
$(document).ready(function() {
    //栏目
    $.ajax({
        url: baseURL + '/api/?c=sign&a=generate',
        type: 'post',
        data:{
            t:'columns',
            f:'type_infos'
        },
        success: function(res) {
            let {data} = JSON.parse(res);
            renderColumn(data);
        }
    });
    //文章
    $.ajax({
        url: baseURL + '/api/?c=sign&a=generate',
        type: 'post',
        data:{
            t:'archives',
            f:'article_infos'
        },
        success: function(res) {
            let {data} = JSON.parse(res);
            if($('#details').length){
                renderArticleDetail(data,getHtmlName()[0]);
                renderRecommend(data);
            }else if($('#pagelist').length){
                let current = getHtmlName()[getHtmlName().length-1];
                if(!current){current = 1;}
                renderArticle(data,current,localStorage.getItem('typeid'),pageSize=1);
            }else if($('#newTag').length){
                renderTagList(data,tag='',current=1,pageSize=10);
            }else{
                renderBanner(data);
                renderArticle(data,1,getUrlParam('id'),pageSize=10);
                renderBannerRecommend(data);
                renderTop(data);
            }
            renderHotArticle(data,0);
        }
    })
    //标签
    $.ajax({
        url: baseURL + '/api/?c=sign&a=generate',
        type: 'post',
        data:{
            t:'tags',
            f:'tag_infos'
        },
        success: function(res) {
            let {data} = JSON.parse(res);
            renderTag(data);
        }
    })
});