// Secret Entrance - Stack theme
// 位置：菜单最后一项下面放一个“看不见的按钮”
// 触发：2 秒内连击 REQUIRED_CLICKS 次 → 输入密码 → 进入 /private/
// 额外：解锁后会记住状态，并自动把搜索数据源切到 /private/index.json
(function () {
    'use strict';

    console.log('🔐 Secret entrance script loaded!');

    // ========== 配置区 ==========
    const SECRET_PASSWORD = 'mimimima';     // 密码
    const SECRET_URL = '/private/';         // 私密区 URL（你已经能打开了）
    const CLICK_TIMEOUT = 2000;             // 连点的时间窗口（毫秒）
    const REQUIRED_CLICKS = 5;              // 连点次数
    const DEBUG_MODE = false;               // 调试时改成 true，会看到红框
    const STORAGE_KEY = 'stack-secret-unlocked';  // 本地记住已解锁
    const PRIVATE_SEARCH_JSON = '/private/index.json'; // 私密区搜索用的 JSON

    // ========== 状态变量 ==========
    let clickCount = 0;
    let clickTimer = null;

    // ========== 启动 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🚀 Initializing secret entrance...');
        // 1) 创建隐藏入口
        setTimeout(createSecretTrigger, 800);
        // 2) 如果之前已经解锁过，直接进入“私密模式”
        if (localStorage.getItem(STORAGE_KEY) === '1') {
            console.log('🔁 secret already unlocked, applying private mode…');
            applyPrivateMode();
        }
    }

    // ========== 创建隐藏入口 ==========
    function createSecretTrigger() {
        const menuContainer =
            document.querySelector('#left-sidebar .menu') ||
            document.querySelector('.left-sidebar .menu') ||
            document.querySelector('aside .menu') ||
            document.querySelector('.sidebar .menu');

        if (!menuContainer) {
            console.error('❌ Menu container not found');
            return;
        }

        console.log('✅ Menu container found');

        const menuItems = menuContainer.querySelectorAll('li');
        if (!menuItems.length) {
            console.warn('⚠️ No menu items found');
            return;
        }

        const lastMenuItem = menuItems[menuItems.length - 1];
        const lastMenuLink = lastMenuItem.querySelector('a') || lastMenuItem;

        const computedStyle = window.getComputedStyle(lastMenuLink);
        const realHeight = lastMenuLink.offsetHeight || 50;
        const liStyle = window.getComputedStyle(lastMenuItem);

        // 创建触发器
        const trigger = document.createElement('li');
        trigger.id = 'secret-trigger';
        trigger.style.height = realHeight + 'px';
        trigger.style.minHeight = realHeight + 'px';
        trigger.style.width = '100%';
        trigger.style.cursor = 'default';
        trigger.style.listStyle = 'none';
        trigger.style.margin = liStyle.margin;
        trigger.style.padding = '0';
        trigger.style.position = 'relative';
        trigger.style.display = 'block';

        if (DEBUG_MODE) {
            trigger.style.background = 'rgba(255, 0, 0, 0.3)';
            trigger.style.border = '2px solid red';
        } else {
            trigger.style.background = 'transparent';
            trigger.style.border = 'none';
        }

        // 点击区域
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

        if (DEBUG_MODE) {
            clickArea.style.background = 'rgba(0, 255, 0, 0.2)';
            clickArea.style.border = '1px dashed green';
            clickArea.style.color = 'red';
            clickArea.innerHTML =
                '<div style="padding:5px;font-size:12px;">🔒 SECRET (' +
                REQUIRED_CLICKS +
                ' clicks)</div>';
        } else {
            clickArea.style.background = 'transparent';
            clickArea.style.border = 'none';
            clickArea.style.color = 'transparent';
        }

        clickArea.addEventListener('click', handleSecretClick);
        clickArea.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        trigger.appendChild(clickArea);

        // 插入菜单
        if (lastMenuItem.nextSibling) {
            menuContainer.insertBefore(trigger, lastMenuItem.nextSibling);
        } else {
            menuContainer.appendChild(trigger);
        }

        console.log('✅ Secret trigger created! DEBUG_MODE:', DEBUG_MODE);
    }

    // ========== 点击检测 ==========
    function handleSecretClick(e) {
        e.preventDefault();
        e.stopPropagation();

        clickCount += 1;
        console.log('🖱️ Click', clickCount, '/', REQUIRED_CLICKS);

        if (clickTimer) {
            clearTimeout(clickTimer);
        }

        if (clickCount >= REQUIRED_CLICKS) {
            console.log('🎯 Required clicks reached!');
            showPasswordPrompt();
            clickCount = 0;
            return;
        }

        clickTimer = setTimeout(function () {
            console.log('⏱️ Timeout - reset click count');
            clickCount = 0;
        }, CLICK_TIMEOUT);
    }

    // ========== 密码弹窗 ==========
    function showPasswordPrompt() {
        const password = prompt('🔐 Enter the secret password:');

        if (password === null) {
            console.log('❌ User cancelled');
            return;
        }

        if (password === SECRET_PASSWORD) {
            console.log('✅ Password correct!');
            onUnlockSuccess();
        } else {
            console.log('❌ Wrong password');
            alert('❌ Incorrect password. Access denied.');
        }
    }

    // ========== 解锁成功之后做的所有事 ==========
    function onUnlockSuccess() {
        // 1) 存储本地状态
        localStorage.setItem(STORAGE_KEY, '1');
        // 2) 切到“私密模式”（打 data- 属性 + 切搜索）
        applyPrivateMode();
        // 3) 跳转
        window.location.href = SECRET_URL;
    }

    // ========== 应用私密模式（可在刷新后自动走到这里） ==========
    function applyPrivateMode() {
        // 给 <html> 打标记，必要时你还可以用 CSS 根据这个标记隐藏/显示东西
        document.documentElement.dataset.secret = '1';
        // 尝试把搜索源切到私密 JSON
        usePrivateSearch();
    }

    // ========== 切换搜索源到 /private/index.json ==========
    function usePrivateSearch() {
        console.log('🔎 Switching to private search source:', PRIVATE_SEARCH_JSON);

        // 1) 最通用：给搜索输入框打一个 data 属性
        const searchInput =
            document.querySelector('input[type="search"]') ||
            document.querySelector('.search-input') ||
            document.querySelector('#search-input');

        if (searchInput) {
            searchInput.dataset.searchSource = PRIVATE_SEARCH_JSON;
        }

        // 2) 如果主题有全局搜索对象，就调用一下（不同版本的 Stack 可能没有这一层，调用失败也没关系）
        if (window.STACK && typeof window.STACK.setSearchSource === 'function') {
            try {
                window.STACK.setSearchSource(PRIVATE_SEARCH_JSON);
                console.log('✅ STACK.setSearchSource used.');
            } catch (err) {
                console.warn('⚠️ STACK.setSearchSource failed:', err);
            }
        }

        // 3) 如果你的主题是用一个全局的 window.searchConfig，也可以这样兜底
        if (window.searchConfig) {
            window.searchConfig.indexURL = PRIVATE_SEARCH_JSON;
        }
    }
})();
