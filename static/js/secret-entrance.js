// Secret Entrance - With Working DEBUG_MODE Toggle
// 位置：Search菜单项下方
// 触发：2秒内连击4次（可修改为5次），输入密码 mimimima
(function() {
    'use strict';
    
    console.log('🔐 Secret entrance script loaded!');
    
    // ========== 配置区 ==========
    const SECRET_PASSWORD = 'mimimima';        // 密码
    const SECRET_URL = '/page/secret/';        // 隐藏页面URL
    const CLICK_TIMEOUT = 2000;                // 2秒内连击
    const REQUIRED_CLICKS = 5;                 // 需要4次点击（改成5就是5次）
    const DEBUG_MODE = false;                  // true: 显示红色边框；false: 完全隐形
    
    let clickCount = 0;
    let clickTimer = null;
    
    // 等待DOM加载完成
    function init() {
        console.log('🚀 Initializing secret entrance...');
        setTimeout(createSecretTrigger, 800);
    }
    
    // 创建隐秘触发器
    function createSecretTrigger() {
        const menuContainer = document.querySelector('#left-sidebar .menu') ||
                            document.querySelector('.left-sidebar .menu') ||
                            document.querySelector('aside .menu') ||
                            document.querySelector('.sidebar .menu');
        
        if (!menuContainer) {
            console.error('❌ Menu container not found');
            return;
        }
        
        console.log('✅ Menu container found');
        
        const menuItems = menuContainer.querySelectorAll('li');
        console.log('📊 Found ' + menuItems.length + ' menu items');
        
        if (menuItems.length === 0) {
            return;
        }
        
        const lastMenuItem = menuItems[menuItems.length - 1];
        const lastMenuLink = lastMenuItem.querySelector('a') || lastMenuItem;
        
        const computedStyle = window.getComputedStyle(lastMenuLink);
        const realHeight = lastMenuLink.offsetHeight || 50;
        
        console.log('📏 Menu item height: ' + realHeight + 'px');
        
        // 创建触发器
        const trigger = document.createElement('li');
        trigger.id = 'secret-trigger';
        
        const liStyle = window.getComputedStyle(lastMenuItem);
        
        // 基础样式（无论调试与否都需要）
        trigger.style.height = realHeight + 'px';
        trigger.style.minHeight = realHeight + 'px';
        trigger.style.width = '100%';
        trigger.style.cursor = 'default';
        trigger.style.listStyle = 'none';
        trigger.style.margin = liStyle.margin;
        trigger.style.padding = '0';
        trigger.style.position = 'relative';
        trigger.style.display = 'block';
        
        // 根据 DEBUG_MODE 设置不同的可见性
        if (DEBUG_MODE) {
            // 调试模式：显示红色边框
            trigger.style.background = 'rgba(255, 0, 0, 0.3)';
            trigger.style.border = '2px solid red';
            trigger.style.opacity = '1';
        } else {
            // 生产模式：完全隐形但可点击
            trigger.style.background = 'transparent';
            trigger.style.border = 'none';
            trigger.style.opacity = '1';  // 保持1，用transparent隐藏
        }
        
        // 创建可点击区域
        const clickArea = document.createElement('a');
        clickArea.href = 'javascript:void(0);';
        
        clickArea.style.display = 'block';
        clickArea.style.width = '100%';
        clickArea.style.height = '100%';
        clickArea.style.minHeight = realHeight + 'px';
        clickArea.style.padding = computedStyle.padding;
        clickArea.style.cursor = 'default';
        clickArea.style.position = 'relative';
        clickArea.style.zIndex = '100';
        clickArea.style.textDecoration = 'none';
        
        // 根据 DEBUG_MODE 设置点击区域的可见性
        if (DEBUG_MODE) {
            // 调试模式：绿色边框和文字
            clickArea.style.background = 'rgba(0, 255, 0, 0.2)';
            clickArea.style.border = '1px dashed green';
            clickArea.style.color = 'red';
            clickArea.innerHTML = '<div style="padding: 5px; font-size: 12px;">🔒 SECRET (' + REQUIRED_CLICKS + ' clicks)</div>';
        } else {
            // 生产模式：透明无内容
            clickArea.style.background = 'transparent';
            clickArea.style.border = 'none';
            clickArea.style.color = 'transparent';
        }
        
        // 绑定事件
        clickArea.addEventListener('click', handleSecretClick);
        clickArea.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
        
        trigger.appendChild(clickArea);
        
        // 插入菜单
        if (lastMenuItem.nextSibling) {
            menuContainer.insertBefore(trigger, lastMenuItem.nextSibling);
        } else {
            menuContainer.appendChild(trigger);
        }
        
        console.log('✅ Secret trigger created! DEBUG_MODE: ' + DEBUG_MODE);
    }
    
    // 处理点击事件
    function handleSecretClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        clickCount = clickCount + 1;
        console.log('🖱️ Click ' + clickCount + '/' + REQUIRED_CLICKS);
        
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        if (clickCount >= REQUIRED_CLICKS) {
            console.log('🎯 Required clicks reached!');
            showPasswordPrompt();
            clickCount = 0;
            return;
        }
        
        clickTimer = setTimeout(function() {
            console.log('⏱️ Timeout - reset click count');
            clickCount = 0;
        }, CLICK_TIMEOUT);
    }
    
    // 显示密码输入框
    function showPasswordPrompt() {
        var password = prompt('🔐 Enter the secret password:');
        
        if (password === null) {
            console.log('❌ User cancelled');
            return;
        }
        
        console.log('🔑 Password entered');
        
        if (password === SECRET_PASSWORD) {
            console.log('✅ Password correct! Redirecting...');
            alert('✅ Access granted!');
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
