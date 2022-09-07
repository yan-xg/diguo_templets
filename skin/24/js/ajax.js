const baseURL="http://192.168.1.16:8009";function getUrlParam(a){a=new RegExp("(^|&)"+a+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(a);return null!=a?unescape(a[2]):null}function getHtmlName(){var a=window.location.href,e=a.lastIndexOf("/"),e=(e=a.substring(e+1,a.length-5)).match(/\d+/g);return window.Array.isArray(e)?e:[]}function renderColumn(a){getUrlParam("id")&&getUrlParam("id"),$.ajax({url:baseURL+"/api/?c=type&a=lists",type:"post",data:{sign:a.sign,reid:0},success:function(a){let e=JSON.parse(a)["data"],t='<li><a href="/">首页</a></li>';e.forEach(a=>{t+=`<li><a href="${baseURL+a.typedir+"/"}" onclick="clickId(${a.id})">${a.typename}</a></li>`}),$("#starlist").html(t)}})}function clickId(a){localStorage.setItem("typeid",a)}function renderArticle(a,e,i,t=10){let s=a.sign;$.ajax({url:baseURL+"/api/?c=archive&a=lists",type:"post",data:{sign:s,pageSize:t,current:e,typeid:i},success:function(a){let e=JSON.parse(a)["data"],t="";e.list.forEach(a=>{t+=`<li class="blogs_list">
                            <a href="${baseURL+a.url}" target="_blank">
                                <i><img src="${baseURL+a.litpic}" alt="机械制造行业未来的前景"></i>
                                <h2>${a.title}</h2>
                            </a>
                            <p>${a.description}</p>
                            <div class="blogs_writer"><span class="blogs_time">${a.created_at}</span></div>
                            <div class="blogs_tags">
                                <a href='${baseURL+a.typedir}' target='_blank'>${a.typename}</a>
                            </div>
                            <span class="blogs_lm"><a href="${baseURL+a.typedir}" target="_blank">${a.typename}</a></span>
                        </li>`}),$("#article").html(t),$("#pagelist").length&&callBackPage(s,i,Number(e.current),Number(e.total),Number(e.pageSize))}})}function renderHotArticle(a,e,t=5){$.ajax({url:baseURL+"/api/?c=archive&a=hot",type:"post",data:{sign:a.sign,offset:e,pageSize:t},success:function(a){let e=JSON.parse(a)["data"],t="";e.list?.forEach((a,e)=>{t+=`<li>
                            <a href="${baseURL+a.url}" title="${a.title}" target="_blank">
                                <i><img src="${baseURL+a.litpic}" alt="机械制造行业未来的前景"></i><em>${e+1}</em>
                                <h2>${a.title}</h2>
                                <span>${a.created_at}</span>
                            </a>
                        </li>`}),$("#hotarticle").html(t)}})}function renderArticleDetail(a,e){$.ajax({url:baseURL+"/api/?c=archive&a=detail",type:"post",data:{sign:a.sign,aid:e},success:function(a){let e=JSON.parse(a)["data"],t=e.keywords.split(","),i=(t.pop(),"");t.forEach(a=>{i+=`<a href="/tags/${a}/" target="_blank">${a}</a>`});a=`<h1>${e.title}</h1>
            <div class="wz_info">
                <span class="wz_frome"><a href="index.html" target="_blank">3D生态网</a></span>
                <span class="wz_time">2020-10-18</span>
            </div>
            <div class="wz_smalltext">${e.description}</div>
            <div class="content">${e.body}</div>
            <div class="wz_zhuanzai">
              <p>所有文章未经授权禁止转载、摘编、复制或建立镜像，违规转载法律必究。</p>
              <p>举报邮箱：<a href="javascript:;" target="_blank">dacesmiling@qq.com</a></p>
            </div>
            <div class="tags"> 相关标签：${i}</div>
            <div class="info-pre-next">
                <p>${e.pre}</a></p>
                <p>${e.next}</p>
            </div>
            <div class="ad"></div>`;$("#details").html(a),$("#weizhi").html(e.position)}})}function renderBanner(a,e="c,p",t=0,i=10){$.ajax({url:baseURL+"/api/?c=archive&a=flags",type:"post",data:{sign:a.sign,flag:e,offset:t,pageSize:i},success:function(a){let e=JSON.parse(a)["data"],t="";e.list.forEach((a,e)=>{t+=`<div class="swiper-slide">
                            <a href="javascript:;" target="_blank"><img src="${baseURL+a.litpic}" alt="【阿里云】专属小站折扣价，新用户独享优惠">
                            <section>
                                <h4>${a.title}</h4>
                            </section>
                            </a>
                        </div>`}),$("#swiper-wrapper").html(t);new Swiper(".swiper-container",{pagination:".swiper-pagination",nextButton:".swiper-button-next",prevButton:".swiper-button-prev",paginationClickable:!0,spaceBetween:100,centeredSlides:!0,autoplay:8e3,autoplayDisableOnInteraction:!1})}})}function renderBannerRecommend(a,e="c,p",t,i=2){$.ajax({url:baseURL+"/api/?c=archive&a=flags",type:"post",data:{sign:a.sign,flag:e,offset:t,pageSize:i},success:function(a){let e=JSON.parse(a)["data"],t="";e.list.forEach((a,e)=>{t+=`<li>
                            <a href="${baseURL+a.url}" title="${a.title}">
                                <img src="${baseURL+a.litpic}" alt="${a.title}">
                                <span>
                                    <h4>${a.title}</h4>
                                </span>
                            </a>
                        </li>`}),$("#headline").html(t)}})}function renderTop(a,e="c,p",t=0,i=10){$.ajax({url:baseURL+"/api/?c=archive&a=flags",type:"post",data:{sign:a.sign,flag:e,offset:t,pageSize:i},success:function(a){let e=JSON.parse(a)["data"],t="";e.list?.forEach((a,e)=>{t+=`<li><i></i><a href="${baseURL+a.url}" target="_blank">${a.title}</a><span>${a.created_at}</span></li>`}),$("#newTop").html(t)}})}function renderTag(a){$.ajax({url:baseURL+"/api/?c=tags&a=hot",type:"post",data:{sign:a.sign},success:function(a){let e=JSON.parse(a)["data"],t="";e.forEach((a,e)=>{t+=`<a href="${baseURL+a.url}" target="_blank">${a.tag}</a>`}),$(".tag-list").html(t)}})}function renderRecommend(a,e="c,p",t=0,i=4){$.ajax({url:baseURL+"/api/?c=archive&a=flags",type:"post",data:{sign:a.sign,flag:e,offset:t,pageSize:i},success:function(a){let e=JSON.parse(a)["data"],t="";e.list?.forEach((a,e)=>{t+=`<li>
                            <a href="${baseURL+a.url}" target="_blank">
                            <i><img src="${baseURL+a.litpic}" alt="机械制造行业未来的前景"></i>
                            <h2>${a.title}</h2>
                            <span>${a.created_at}</span>
                            </a>
                        </li>`}),$("#recommend").html(t)}})}function callBackPage(a,e,t,i,s){let l=`<li><a href='list_${e}_1.html'>首页</a></li>`;var r=Math.ceil(i/s);let n=+getHtmlName()[getHtmlName().length-1];if(n=n||1,r<6)for(var c=0;c<r;c++)l+=`<li class="${n==c+1?"thisclass":""}"><a href='list_${e}_${c+1}.html'>${c+1}</a></li>`;else if(n<=3)for(c=0;c<5;c++)l+=`<li class="${n==c+1?"thisclass":""}"><a href='list_${e}_${c+1}.html'>${c+1}</a></li>`;else if(n>=r-2)for(c=r-4;c<r;c++)l+=`<li class="${n==c+1?"thisclass":""}"><a href='list_${e}_${c+1}.html'>${c+1}</a></li>`;else for(c=n-2;c<n+3;c++)l+=`<li class="${n==c+1?"thisclass":""}"><a href='list_${e}_${c+1}.html'>${c+1}</a></li>`;l+=`<li><a href='javascript#'>共${r}页/${i}条</a></li>`,$("#pagelist").html(l)}console.log(window.Array.isArray(getHtmlName())),$(document).ready(function(){$.ajax({url:baseURL+"/api/?c=sign&a=generate",type:"post",data:{t:"columns",f:"type_infos"},success:function(a){a=JSON.parse(a).data;renderColumn(a)}}),$.ajax({url:baseURL+"/api/?c=sign&a=generate",type:"post",data:{t:"archives",f:"article_infos"},success:function(e){e=JSON.parse(e).data;if($("#details").length)renderArticleDetail(e,getHtmlName()[0]),renderRecommend(e);else if($("#pagelist").length){let a=getHtmlName()[getHtmlName().length-1];renderArticle(e,a=a||1,localStorage.getItem("typeid"),pageSize=1)}else $("#newTag").length?renderTagList(e,tag="",current=1,pageSize=10):(renderBanner(e),renderArticle(e,1,getUrlParam("id"),pageSize=10),renderBannerRecommend(e),renderTop(e));renderHotArticle(e,0)}}),$.ajax({url:baseURL+"/api/?c=sign&a=generate",type:"post",data:{t:"tags",f:"tag_infos"},success:function(a){a=JSON.parse(a).data;renderTag(a)}})});