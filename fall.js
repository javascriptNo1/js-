// 定义瀑布流算法函数
function fall(info) {
  if (info.parent_el_width){
    document.querySelectorAll(info.parent_el)[0].style.width = info.parent_el_width + 'px';
  }
  document.querySelectorAll(info.parent_el)[0].style.position = 'relative';
  const pageWidth = info.parent_el_width || window.innerWidth - getScrollbarWidth(); // 容器寬度
  const itemWidth = pageWidth / info.column; // 每一项的宽度，即当前每一个图片容器的宽度。保证每一列都是等宽不等高的。255 204 170
  const column = Math.floor(info.column); // 实际列数=页面宽度/(图片宽度+最小间距)
  const gap = (pageWidth - itemWidth * column) / column/2;  // 计算真实间距 = (页面宽度- 图片宽度*实际列数)/实际列数/2
  const items = document.querySelectorAll(info.el); // 获取所有的外层元素
  const heightArr = []; // 定义一个空数组，保存最低高度。
  for (let i = 0; i < items.length; i++) {
    // 遍历所有的外层容器
    items[i].style.width = itemWidth + 'px'
    items[i].style.position = 'absolute'
    const height = items[i].offsetHeight + info.spacing;
    // 如果当前处在第一行
    if (i < column) {
      // 直接设置元素距离上部的位置和距离左边的距离。
      items[i].style.top = `${gap}px`
      items[i].style.left = `${(itemWidth + gap) * i + gap}px`
      // 保存当前元素的高度。
      heightArr.push(height);
    } else {
      // 不是第一行的话，就进行比对。
      let minHeight = heightArr[0]; // 先保存第一项的高度
      let minIndex = 0; // 保存第一项的索引值
      for (let j = 0; j < heightArr.length; j++) {
        // 通过循环遍历比对，拿到最小值和最小值的索引。
        if (minHeight > heightArr[j]) {
          minHeight = heightArr[j];
          minIndex = j;
        }
      }
      // 通过最小值为当前元素设置top值，通过索引为当前元素设置left值。
      items[i].style.top = `${(minHeight + gap * 2)}px`
      items[i].style.left = `${(itemWidth + gap) * minIndex + gap}px`
      // 并修改当前索引的高度为当前元素的高度
      heightArr[minIndex] = minHeight + gap + height;
    }
  }
  document.querySelectorAll(info.parent_el)[0].style.height = Math.max(...heightArr) + 'px';
  // 获取滚动条的宽度
  function getScrollbarWidth() {
    const oDiv = document.createElement('div');//创建一个div
    // 给div设置样式。随便定义宽高，只要能获取到滚动条就可以
    oDiv.style.cssText = `width: 50px;height: 50px;overflow: scroll;`
    document.body.appendChild(oDiv);//把div添加到body中
    const scrollbarWidth = oDiv.offsetWidth - oDiv.clientWidth;// 使最大宽度和可视宽度相减，获得到滚动条宽度。
    oDiv.remove();//移除创建的div
    return scrollbarWidth;//返回滚动条宽度
  }
}
// 页面加载完成调用一次。
window.onload = function () {
  fall({
    parent_el:'.product_style4_item_box', // 父級盒子容器
    el:'.product_item', // 項目元素
    parent_el_width: 1020, // 容器寬度 不傳默認為全屏 手機版傳0或者不傳
    column: 4, //列數 手機版列數為2
    spacing: 10, //上下間距
  })
};