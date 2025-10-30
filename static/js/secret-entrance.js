// Secret Entrance - Complete Fixed Version
// 位置：Search菜单项下方，与其他菜单项大小完全相同
// 触发：2秒内连击4次，输入密码 mimimima
(function() {
    'use strict';
    
    console.log('🔐 Secret entrance script loaded!');
    
    // ========== 配置区 ==========
    const SECRET_PASSWORD = 'mimimima';        // 密码
    const SECRET_URL = '/page/secret/';        // 隐藏页面URL
    const CLICK_TIMEOUT = 2000;                // 2秒内连击
    const REQUIRED_CLICKS = 5;                 // 需要4次点击
    const DEBUG_MODE = true;                   // 调试模式：显示红色边框
    
    let clickCount = 0;
    let clickTimer = null;
    
    // 等待DOM加载完成
    function init() {
        console.log('🚀 Initializing secret entrance...');
        
        // 等待左侧栏菜单加载完成
        setTimeout(() => {
            createSecretTrigger();
        }, 800);  // 增加等待时间确保菜单完全加载
    }
    
    // 创建隐秘触发器
    function createSecretTrigger() {
        // 查找左侧栏菜单容器（尝试多个选择器）
        const menuContainer = document.querySelector('#left-sidebar .menu') ||
                            document.querySelector('.left-sidebar .menu') ||
                            document.querySelector('aside .menu') ||
                            document.querySelector('.sidebar .menu') ||
                            document.querySelector('.main-menu') ||
                            document.querySelector('nav.menu');
        
        if (!menuContainer) {
            console.error('❌ Menu container not found');
            console.log('Available elements:', document.querySelector('#left-sidebar'));
            createFallbackTrigger();
            return;
        }
        
        console.log('✅ Menu container found:', menuContainer);
        
        // 获取所有菜单项
        const menuItems = menuContainer.querySelectorAll('li');
        console.log(`📊 Found ${menuItems.length} menu items`);
        
        if (menuItems.length === 0) {
            console.error('❌ No menu items found');
            createFallbackTrigger();
            return;
        }
        
        // 获取最后一个菜单项（Search）
        const lastMenuItem = menuItems[menuItems.length - 1];
        
        // 尝试获取菜单项内的链接元素（真正的点击区域）
        const lastMenuLink = lastMenuItem.querySelector('a') || lastMenuItem;
        
        // 获取真实的尺寸（包括padding和margin）
        const computedStyle = window.getComputedStyle(lastMenuLink);
        const realHeight = lastMenuLink.offsetHeight || 
                          parseInt(computedStyle.height) || 
                          50;  // 默认50px
        const realWidth = menuContainer.offsetWidth || lastMenuLink.offsetWidth;
        
        console.log(`📏 Menu item real size: ${realWidth}x${realHeight}px`);
        console.log(`📏 Computed height: ${computedStyle.height}`);
        console.log(`📏 Offset height: ${lastMenuLink.offsetHeight}px`);
        
        // 创建隐形触发器（作为新的菜单项）
        const trigger = document.createElement('li');
        trigger.id = 'secret-trigger';
        
        // 复制最后一个菜单项的样式
        const liComputedStyle = window.getComputedStyle(lastMenuItem);
        
        trigger.style.cssText = `
            height: ${realHeight}px;
            min-height: ${realHeight}px;
            width: 100%;
            cursor: default;
            list-style: none;
            margin: ${liComputedStyle.margin};
            padding: 0;
            position: relative;
            display: block;
            ${DEBUG_MODE ? 'background: rgba(255, 0, 0, 0.3) !important;' : 'opacity: 0.9;'}
            ${DEBUG_MODE ? 'border: 2px solid red !important;' : ''}
        `;
        
        // 创建内部链接样式的可点击区域
        const clickArea = document.createElement('a');
        clickArea.href = 'javascript:void(0);';
        clickArea.style.cssText = `
            display: block;
            width: 100%;
            height: 100%;
            min-height: ${realHeight}px;
            padding: ${computedStyle.padding};
            cursor: default;
            position: relative;
            z-index: 100;
            ${DEBUG_MODE ? 'background: rgba(0, 255, 0, 0.2) !important;' : 'background: transparent;'}
            ${DEBUG_MODE ? 'border: 1px dashed green !important;' : ''}
        `;
        
        // 添加可见的文本（仅在调试模式）
        if (DEBUG_MODE) {
            clickArea.innerHTML = `
                <div style="color: red; font-size: 12px; padding: 5px;">
                    🔒 SECRET (${REQUIRED_CLICKS} clicks)
                </div>
            `;
        }
        
        // 绑定点击事件
        clickArea.addEventListener('click', handleSecretClick);
        
        // 阻止默认行为
        clickArea.addEventListener('mousedown', (e) => e.preventDefault());
        
        trigger.appendChild(clickArea);
        
        // 插入到Search后面
        if (lastMenuItem.nextSibling) {
            menuContainer.insertBefore(trigger, lastMenuItem.nextSibling);
        } else {
            menuContainer.appendChild(trigger);
        }
        
        console.log('✅ Secret trigger created below Search!');
        console.log('📍 Trigger element:', trigger);
        console.log('📍 Trigger dimensions:', trigger.getBoundingClientRect());
    }
    
    // 备用方案：在页面右下角创建明显的测试按钮
    function createFallbackTrigger() {
        const trigger = document.createElement('div');
        trigger.id = 'secret-trigger-fallback';
        trigger.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 100px;
            height: 100px;
            cursor: pointer;
            background: rgba(255, 0, 0, 0.5);
            z-index: 99999;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        trigger.innerHTML = '🔒<br>SECRET<br>CLICK 4X';
        
        trigger.addEventListener('click', handleSecretClick);
        document.body.appendChild(trigger);
        
        console.log('⚠️ Using fallback trigger (right-bottom corner)');
    }
    
    // 处理点击事件
    function handleSecretClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        clickCount++;
        console.log(`🖱️ Click ${clickCount}/${REQUIRED_CLICKS}`);
        console.log(`⏰ Time window: ${CLICK_TIMEOUT}ms`);
        
        // 清除之前的计时器
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        // 检查是否达到要求的点击次数
        if (clickCount >= REQUIRED_CLICKS) {
            console.log('🎯 Required clicks reached!');
            showPasswordPrompt();
            clickCount = 0;
            return;
        }
        
        // 设置重置计时器
        clickTimer = setTimeout(() => {
            console.log('⏱️ Timeout - reset click count');
            clickCount = 0;
        }, CLICK_TIMEOUT);
    }
    
    // 显示密码输入框
    function showPasswordPrompt() {
        const password = prompt('🔐 Enter the secret password:');
        
        if (password === null) {
            console.log('❌ User cancelled');
            return;
        }
        
        console.log('🔑 Password entered:', password ? '***' : '(empty)');
        
        if (password === SECRET_PASSWORD) {
            console.log('✅ Password correct! Redirecting...');
            alert('✅ Access granted! Redirecting to secret page...');
            window.location.href = SECRET_URL;
        } else {
            console.log('❌ Wrong password. Expected:', SECRET_PASSWORD);
            alert('❌ Incorrect password. Access denied.');
        }
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 额外：监听整个菜单容器的点击（帮助调试）
    document.addEventListener('click', function(e) {
        if (e.target.id === 'secret-trigger' || 
            e.target.closest('#secret-trigger')) {
            console.log('🎯 Clicked on secret trigger!');
        }
    }, true);
})();
