/**
 * 全局变量和函数,这些变量和函数对用户透明
 **/


/* 基础函数库 */

// erpath jump
function go(path) {
	window.location = path;
};


/**
 * 判断是否有下一页
 * page : 当前页号
 * total: 总记录数
 * pageSize: 每页记录个数
 * cn : 本页记录个数
 **/
function has_next_page(page, total, pageSize, cn)
{
	if (cn<pageSize) return false;
	var pageCount = Math.ceil(total/pageSize);
	return page<pageCount;
}
