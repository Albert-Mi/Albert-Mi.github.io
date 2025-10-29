// Secret Entrance with Triple Click
(function() {
    'use strict';
    
    // ========== 配置区 ==========
    const SECRET_PASSWORD = 'password:';  // 👈 在这里修改你的密码
    const SECRET_URL = '/page/secret/';       // 隐藏页面的URL
    const CLICK_TIMEOUT = 500;                // 连续点击的时间窗口（毫秒）
    
    let clickCount = 0;
    let clickTimer = null;
    
    // 创建隐形触发区域
    function createSecretTrigger() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createSecretTrigger);
            return;
        }
        
        // 找到左侧栏
        const sidebar = document.querySelector('.left-sidebar') || 
                       document.querySelector('aside') ||
                       document.querySelector('.sidebar');
        
        if (!sidebar) {
            console.log('Sidebar not found');
            return;
        }
        
        // 创建隐形触发区
        const trigger = document.createElement('div');
        trigger.id = 'secret-trigger';
        trigger.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 60px;
            cursor: default;
            opacity: 0;
            z-index: 999;
        `;
        
        // 添加三击监听
        trigger.addEventListener('click', handleSecretClick);
        
        sidebar.appendChild(trigger);
    }
    
    // 处理点击事件
    function handleSecretClick(e) {
        e.preventDefault();
        clickCount++;
        
        // 清除之前的计时器
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        // 检查是否达到三次点击
        if (clickCount >= 3) {
            showPasswordPrompt();
            clickCount = 0;
            return;
        }
        
        // 设置重置计时器
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, CLICK_TIMEOUT);
    }
    
    // 显示密码输入框
    function showPasswordPrompt() {
        const password = prompt('🔐 Enter password:');
        
        if (password === null) {
            return; // 用户取消
        }
        
        if (password === SECRET_PASSWORD) {
            // 密码正确，跳转
            window.location.href = SECRET_URL;
        } else {
            alert('❌ Incorrect password');
        }
    }
    
    // 初始化
    createSecretTrigger();
})();
