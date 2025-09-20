// 大乐透预测系统前端脚本 - 最终修复版本
console.log('系统初始化中...');

// 全局状态管理 - 完全避免React相关代码
const SystemState = {
    isInitialized: false,
    apiBaseUrl: window.location.origin,
    requestsInProgress: new Set(),
    lastUpdateTime: null,
    systemHealth: 'unknown'
};

// 请求管理器 - 修复API调用问题
class APIRequestManager {
    constructor() {
        this.timeout = 15000;
        this.maxRetries = 2;
    }

    async makeRequest(endpoint, options = {}) {
        const requestId = `${endpoint}-${Date.now()}`;
        
        // 防止重复请求
        if (SystemState.requestsInProgress.has(endpoint)) {
            console.log(`请求 ${endpoint} 已在进行中，跳过重复请求`);
            return null;
        }

        SystemState.requestsInProgress.add(endpoint);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const requestConfig = {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...options
            };

            console.log(`发送请求到: ${SystemState.apiBaseUrl}${endpoint}`);
            
            const response = await fetch(`${SystemState.apiBaseUrl}${endpoint}`, requestConfig);
            
            clearTimeout(timeoutId);

            console.log(`响应状态: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // 检查响应内容类型
            const contentType = response.headers.get('content-type');
            console.log(`响应内容类型: ${contentType}`);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('非JSON响应内容:', textResponse.substring(0, 200));
                throw new Error(`服务器返回非JSON数据。内容类型: ${contentType}`);
            }

            const data = await response.json();
            console.log(`请求成功: ${endpoint}`, data);
            return data;

        } catch (error) {
            console.error(`请求失败: ${endpoint}`, error);
            
            if (error.name === 'AbortError') {
                throw new Error(`请求超时 (${this.timeout/1000}秒)`);
            }
            
            throw error;
        } finally {
            SystemState.requestsInProgress.delete(endpoint);
        }
    }
}

const apiManager = new APIRequestManager();

// DOM Ready事件处理 - 避免React相关错误
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化系统...');
    
    // 延迟初始化，确保DOM完全就绪
    setTimeout(() => {
        try {
            initializeSystem();
        } catch (error) {
            console.error('系统初始化失败:', error);
            showErrorNotification('系统初始化失败: ' + error.message);
        }
    }, 200);
});

// 系统初始化函数
async function initializeSystem() {
    if (SystemState.isInitialized) {
        console.log('系统已经初始化，跳过重复初始化');
        return;
    }

    try {
        console.log('开始系统初始化流程...');
        
        // 首先检查系统健康状态
        await performSystemHealthCheck();
        
        // 然后加载开奖结果
        await loadLatestResultsSafely();
        
        // 设置定期健康检查
        setInterval(performSystemHealthCheck, 60000);
        
        SystemState.isInitialized = true;
        SystemState.lastUpdateTime = new Date();
        
        console.log('系统初始化完成');
        
    } catch (error) {
        console.error('系统初始化过程中出错:', error);
        showErrorNotification('系统初始化失败，部分功能可能不可用');
    }
}

// 安全的系统健康检查
async function performSystemHealthCheck() {
    try {
        console.log('执行系统健康检查...');
        
        const data = await apiManager.makeRequest('/api/health');
        
        if (data && data.status === 'healthy') {
            updateSystemStatusDisplay('healthy', `系统运行正常 - ${data.service || 'AI预测服务'}`);
            SystemState.systemHealth = 'healthy';
        } else {
            throw new Error('系统健康检查返回异常状态');
        }
        
    } catch (error) {
        console.error('健康检查失败:', error);
        updateSystemStatusDisplay('error', `系统连接异常: ${error.message}`);
        SystemState.systemHealth = 'error';
    }
}

// 更新系统状态显示
function updateSystemStatusDisplay(status, message) {
    const statusElement = document.querySelector('.status-bar');
    if (!statusElement) {
        console.warn('找不到状态显示元素');
        return;
    }

    const isHealthy = status === 'healthy';
    const indicatorColor = isHealthy ? '#4CAF50' : '#f56565';
    const backgroundGradient = isHealthy ? 
        'linear-gradient(90deg, #4CAF50, #45a049)' : 
        'linear-gradient(90deg, #f56565, #e53e3e)';

    statusElement.innerHTML = `
        <div class="status-indicator" style="background: ${indicatorColor};"></div>
        ${message}
    `;
    statusElement.style.background = backgroundGradient;
}

// 安全加载最新开奖结果
async function loadLatestResultsSafely() {
    const contentElement = document.getElementById('latestResultsContent');
    if (!contentElement) {
        console.warn('找不到开奖结果显示元素');
        return;
    }

    try {
        console.log('开始加载最新开奖结果...');
        
        showLoadingInElement(contentElement, '正在获取最新开奖数据...');
        
        const data = await apiManager.makeRequest('/api/latest-results');
        
        if (data && data.status === 'success' && data.latest_results) {
            displayLatestResultsSafely(data.latest_results, contentElement);
        } else {
            throw new Error(data?.message || '开奖数据格式异常');
        }
        
    } catch (error) {
        console.error('加载开奖结果失败:', error);
        contentElement.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #e53e3e;">
                <p>📡 获取开奖数据失败</p>
                <p style="font-size: 0.9em; margin-top: 10px;">${error.message}</p>
                <button onclick="loadLatestResultsSafely()" style="margin-top: 15px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    重试加载
                </button>
            </div>
        `;
    }
}

// 在元素中显示加载状态
function showLoadingInElement(element, message = '加载中...') {
    element.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <div style="width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
            <p>${message}</p>
        </div>
    `;
}

// 安全显示最新开奖结果
function displayLatestResultsSafely(results, container) {
    try {
        if (!results || !results.winning_numbers) {
            throw new Error('开奖数据结构异常');
        }

        const { front_zone = [], back_zone = [] } = results.winning_numbers;
        
        if (front_zone.length !== 5 || back_zone.length !== 2) {
            throw new Error('开奖号码数量异常');
        }

        const frontNumbers = front_zone.map(num => 
            `<div class="number-ball front-number">${String(num).padStart(2, '0')}</div>`
        ).join('');
        
        const backNumbers = back_zone.map(num => 
            `<div class="number-ball back-number">${String(num).padStart(2, '0')}</div>`
        ).join('');
        
        const regionInfo = results.regional_winners?.length > 0 
            ? results.regional_winners.slice(0, 3).map(r => r.province).join('、')
            : '全国各地';

        container.innerHTML = `
            <div style="text-align: center;">
                <h4>第${results.period || 'N/A'}期 (${results.draw_date || 'N/A'})</h4>
                <div class="winning-numbers" style="display: flex; justify-content: center; align-items: center; margin: 15px 0; flex-wrap: wrap;">
                    ${frontNumbers}
                    <span style="margin: 0 10px; font-size: 1.5em; color: white;">+</span>
                    ${backNumbers}
                </div>
                <div class="prize-info" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 15px;">
                    <div class="prize-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                        <strong>销售总额</strong><br>${results.total_sales || '暂无'}
                    </div>
                    <div class="prize-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                        <strong>奖池金额</strong><br>${results.jackpot_info?.current_pool || '暂无'}
                    </div>
                    <div class="prize-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                        <strong>中奖人数</strong><br>${results.statistics?.total_winners || 0}注
                    </div>
                    <div class="prize-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                        <strong>下期开奖</strong><br>${results.next_draw?.date || '暂无'}
                    </div>
                </div>
                <div style="margin-top: 15px; font-size: 0.9em; color: rgba(255,255,255,0.9);">
                    <strong>主要中奖地区:</strong> ${regionInfo}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('显示开奖结果失败:', error);
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ffcccb;">
                <p>🚫 开奖结果显示异常</p>
                <p style="font-size: 0.9em;">${error.message}</p>
            </div>
        `;
    }
}

// 数据分析功能 - 增强错误处理
async function performDataAnalysis() {
    const elements = {
        results: document.getElementById('analysisResults'),
        loading: document.getElementById('analysisLoading'),
        content: document.getElementById('analysisContent')
    };

    if (!elements.results || !elements.content) {
        showErrorNotification('找不到数据分析显示区域');
        return;
    }

    try {
        elements.results.style.display = 'block';
        
        if (elements.loading) {
            elements.loading.style.display = 'block';
        }
        
        elements.content.innerHTML = '';

        console.log('开始执行数据分析...');
        const data = await apiManager.makeRequest('/api/data-analysis');

        if (elements.loading) {
            elements.loading.style.display = 'none';
        }

        if (data && data.status === 'success' && data.analysis) {
            displayAnalysisResults(data.analysis, elements.content);
        } else {
            throw new Error(data?.message || '数据分析结果格式异常');
        }

    } catch (error) {
        console.error('数据分析失败:', error);
        
        if (elements.loading) {
            elements.loading.style.display = 'none';
        }
        
        elements.content.innerHTML = `
            <div style="padding: 15px; background: #fed7d7; color: #c53030; border-radius: 8px;">
                <p><strong>📊 数据分析失败</strong></p>
                <p style="margin-top: 8px; font-size: 0.9em;">${error.message}</p>
                <button onclick="performDataAnalysis()" style="margin-top: 10px; padding: 6px 12px; background: #c53030; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    重试分析
                </button>
            </div>
        `;
    }
}

// 显示分析结果
function displayAnalysisResults(analysis, container) {
    try {
        const overview = analysis.data_overview || {};
        const frontAnalysis = analysis.front_zone_analysis || {};
        const backAnalysis = analysis.back_zone_analysis || {};

        container.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>✅ 数据分析完成</strong></p>
            </div>
            <div style="display: grid; gap: 10px;">
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>分析期数:</strong> ${overview.total_draws || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>更新时间:</strong> ${overview.last_update || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>前区热号:</strong> ${frontAnalysis.hot_numbers?.join(', ') || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>后区热号:</strong> ${backAnalysis.hot_numbers?.join(', ') || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>前区冷号:</strong> ${frontAnalysis.cold_numbers?.join(', ') || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>后区冷号:</strong> ${backAnalysis.cold_numbers?.join(', ') || 'N/A'}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('显示分析结果失败:', error);
        container.innerHTML = `
            <div style="padding: 15px; background: #fed7d7; color: #c53030; border-radius: 8px;">
                <p>分析结果显示异常: ${error.message}</p>
            </div>
        `;
    }
}

// AI预测功能 - 类似的错误处理模式
async function generateAIPrediction() {
    const elements = {
        results: document.getElementById('predictionResults'),
        loading: document.getElementById('predictionLoading'),
        content: document.getElementById('predictionContent')
    };

    if (!elements.results || !elements.content) {
        showErrorNotification('找不到AI预测显示区域');
        return;
    }

    try {
        elements.results.style.display = 'block';
        
        if (elements.loading) {
            elements.loading.style.display = 'block';
        }
        
        elements.content.innerHTML = '';

        console.log('开始AI预测...');
        const data = await apiManager.makeRequest('/api/predict', {
            method: 'POST',
            body: JSON.stringify({
                prediction_type: 'ensemble',
                historical_data: []
            })
        });

        if (elements.loading) {
            elements.loading.style.display = 'none';
        }

        if (data && data.status === 'success' && data.prediction?.ensemble_prediction) {
            displayPredictionResults(data.prediction.ensemble_prediction, elements.content);
        } else {
            throw new Error(data?.message || 'AI预测结果格式异常');
        }

    } catch (error) {
        console.error('AI预测失败:', error);
        
        if (elements.loading) {
            elements.loading.style.display = 'none';
        }
        
        elements.content.innerHTML = `
            <div style="padding: 15px; background: #fed7d7; color: #c53030; border-radius: 8px;">
                <p><strong>🤖 AI预测失败</strong></p>
                <p style="margin-top: 8px; font-size: 0.9em;">${error.message}</p>
                <button onclick="generateAIPrediction()" style="margin-top: 10px; padding: 6px 12px; background: #c53030; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    重试预测
                </button>
            </div>
        `;
    }
}

// 显示预测结果
function displayPredictionResults(prediction, container) {
    try {
        container.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>🤖 AI预测完成</strong></p>
            </div>
            <div style="display: grid; gap: 10px;">
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>前区预测:</strong> ${prediction.front_zone?.join(', ') || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>后区预测:</strong> ${prediction.back_zone?.join(', ') || 'N/A'}
                </div>
                <div style="background: #e8f4fd; padding: 12px; border-radius: 6px; border-left: 3px solid #4299e1;">
                    <strong>置信度:</strong> ${prediction.confidence ? (prediction.confidence * 100).toFixed(1) + '%' : 'N/A'}
                </div>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; font-size: 0.9em;">
                ⚠️ <strong>免责声明:</strong> 本预测仅供参考，请理性购彩，投注有风险。
            </div>
        `;

    } catch (error) {
        console.error('显示预测结果失败:', error);
        container.innerHTML = `
            <div style="padding: 15px; background: #fed7d7; color: #c53030; border-radius: 8px;">
                <p>预测结果显示异常: ${error.message}</p>
            </div>
        `;
    }
}

// 灵修因子和其他功能的类似实现...
async function getSpiritualFactor() {
    // 类似的错误处理模式
    console.log('获取灵修因子功能待实现...');
    showInfoNotification('灵修因子功能正在开发中...');
}

async function performHealthCheck() {
    // 直接调用已有的健康检查
    await performSystemHealthCheck();
    showSuccessNotification('系统健康检查完成');
}

// 通知系统
function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showSuccessNotification(message) {
    showNotification(message, 'success');
}

function showInfoNotification(message) {
    showNotification(message, 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const colors = {
        error: { bg: '#f56565', icon: '❌' },
        success: { bg: '#48bb78', icon: '✅' },
        info: { bg: '#4299e1', icon: 'ℹ️' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: ${color.bg}; color: white; padding: 15px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 350px; font-weight: bold;
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `${color.icon} ${message}`;
    
    document.body.appendChild(notification);
    
    // 滑入动画
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // 自动移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// 全局错误处理
window.addEventListener('error', function(event) {
    console.error('全局JavaScript错误:', event.error);
    showErrorNotification('页面出现异常，请刷新页面重试');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    showErrorNotification('异步操作失败，请重试');
});

console.log('前端脚本加载完成，等待DOM就绪...');
