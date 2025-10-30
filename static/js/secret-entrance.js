// Secret Entrance - Customized Version
// 位置：Search菜单项下方，完全隐形
// 触发：2秒内连击4次，输入密码 mimimima
(function() {
    'use strict';
    
    console.log('🔐 Secret entrance script loaded!');
    
    // ========== 配置区 ==========
    const SECRET_PASSWORD = 'mimimima';        // 密码
    const SECRET_URL = '/page/secret/';        // 隐藏页面URL
    const CLICK_TIMEOUT = 2000;                // 2秒内连击
    const REQUIRED_CLICKS = 4;                 // 需要4次点击
    
    let clickCount = 0;
    let clickTimer = null;
    
    // 等待DOM加载完成
    function init() {
        console.log('🚀 Initializing secret entrance...');
        
        // 等待左侧栏菜单加载完成
        setTimeout(() => {
            createSecretTrigger();
        }, 500);
    }
    
    // 创建隐秘触发器
    function createSecretTrigger() {
        // 查找左侧栏菜单容器
        const menuContainer = document.querySelector('#left-sidebar .menu') ||
                            document.querySelector('.left-sidebar .menu') ||
                            document.querySelector('aside .menu') ||
                            document.querySelector('.sidebar .menu');
        
        if (!menuContainer) {
            console.error('❌ Menu container not found');
            // 备用方案：在body上创建
            createFallbackTrigger();
            return;
        }
        
        console.log('✅ Menu container found:', menuContainer);
        
        // 获取Search菜单项（最后一个菜单项）
        const menuItems = menuContainer.querySelectorAll('li');
        const lastMenuItem = menuItems[menuItems.length - 1];
        
        if (!lastMenuItem) {
            console.error('❌ Menu items not found');
            return;
        }
        
        // 获取菜单项的尺寸
        const itemHeight = lastMenuItem.offsetHeight;
        const itemWidth = lastMenuItem.offsetWidth;
        
        console.log(`📏 Menu item size: ${itemWidth}x${itemHeight}px`);
        
        // 创建隐形触发器，插入到Search后面
        const trigger = document.createElement('li');
        trigger.id = 'secret-trigger';
        trigger.style.cssText = `
            height: ${itemHeight}px;
            width: 100%;
            cursor: default;
            opacity: 0;
            list-style: none;
            margin: 0;
            padding: 0;
            position: relative;
        `;
        
        // 创建可点击区域（填充整个li）
        const clickArea = document.createElement('div');
        clickArea.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            cursor: default;
        `;
        
        clickArea.addEventListener('click', handleSecretClick);
        trigger.appendChild(clickArea);
        
        // 插入到Search后面
        if (lastMenuItem.nextSibling) {
            menuContainer.insertBefore(trigger, lastMenuItem.nextSibling);
        } else {
            menuContainer.appendChild(trigger);
        }
        
        console.log('✅ Secret trigger created below Search!');
    }
    
    // 备用方案：在页面右下角创建
    function createFallbackTrigger() {
        const trigger = document.createElement('div');
        trigger.id = 'secret-trigger-fallback';
        trigger.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 80px;
            height: 80px;
            cursor: pointer;
            background: rgba(255, 0, 0, 0.3);
            z-index: 9999;
            border-radius: 50%;
        `;
        
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
        
        if (password === SECRET_PASSWORD) {
            console.log('✅ Password correct! Redirecting...');
            window.location.href = SECRET_URL;
        } else {
            console.log('❌ Wrong password');
            alert('❌ Incorrect password. Access denied.');
        }
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
