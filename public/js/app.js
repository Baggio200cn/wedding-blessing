// 大乐透预测系统前端脚本 - 修复版本
console.log('系统初始化...');

// 全局状态管理 - 避免React Hook错误
const AppState = {
    isLoading: false,
    lastPrediction: null,
    systemHealth: 'unknown',
    apiCache: new Map(),
    requestQueue: new Set()
};

// 防抖函数，避免重复请求
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 请求管理器，避免连接问题
class APIManager {
    constructor() {
        this.baseURL = window.location.origin;
        this.timeout = 15000; // 15秒超时
        this.retryCount = 3;
    }

    async makeRequest(endpoint, options = {}) {
        const requestId = `${endpoint}-${Date.now()}`;
        
        // 避免重复请求
        if (AppState.requestQueue.has(endpoint)) {
            console.log(`请求 ${endpoint} 已在队列中，跳过重复请求`);
            return null;
        }

        AppState.requestQueue.add(endpoint);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const requestOptions = {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                ...options
            };

            console.log(`发起请求: ${this.baseURL}${endpoint}`);
            const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('非JSON响应:', text.substring(0, 200));
                throw new Error(`服务器返回非JSON格式数据: ${contentType}`);
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
            AppState.requestQueue.delete(endpoint);
        }
    }
}

const apiManager = new APIManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    // 延迟初始化，避免React错误
    setTimeout(() => {
        initializeSystem();
    }, 100);
});

// 系统初始化
function initializeSystem() {
    try {
        checkSystemHealth();
        loadLatestResults();
        
        // 定期健康检查
        setInterval(checkSystemHealth, 60000); // 每分钟检查一次
        
    } catch (error) {
        console.error('系统初始化失败:', error);
        showSystemError('系统初始化失败: ' + error.message);
    }
}

// 系统健康检查 - 防抖版本
const checkSystemHealth = debounce(async function() {
    try {
        console.log('执行系统健康检查...');
        const data = await apiManager.makeRequest('/api/health');
        
        if (data && data.status === 'healthy') {
            updateSystemStatus('healthy', `系统运行正常 - ${data.service} v${data.version}`);
            AppState.systemHealth = 'healthy';
        } else {
            throw new Error('系统状态异常');
        }
    } catch (error) {
        console.error('健康检查失败:', error);
        updateSystemStatus('error', `系统连接失败: ${error.message}`);
        AppState.systemHealth = 'error';
    }
}, 1000);

// 更新系统状态显示
function updateSystemStatus(status, message) {
    const statusEl = document.querySelector('.status-bar');
    if (statusEl) {
        const indicator = status === 'healthy' ? 
            '<div class="status-indicator"></div>' : 
            '<div class="status-indicator" style="background: #f56565;"></div>';
        
        statusEl.innerHTML = indicator + message;
        statusEl.style.background = status === 'healthy' ? 
            'linear-gradient(90deg, #4CAF50, #45a049)' : 
            'linear-gradient(90deg, #f56565, #e53e3e)';
    }
}

// 显示系统错误
function showSystemError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'system-error';
    errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #f56565; color: white; padding: 15px; border-radius: 5px;
        max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `❌ ${message}`;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// 获取最新开奖结果 - 增强版
async function loadLatestResults() {
    try {
        console.log('正在获取最新开奖结果...');
        showLoadingState('latestResultsContent', true);
        
        const data = await apiManager.makeRequest('/api/latest-results');
        
        if (data && data.status === 'success' && data.latest_results) {
            displayLatestResults(data.latest_results);
        } else {
            throw new Error(data?.message || '数据格式错误');
        }
    } catch (error) {
        console.error('获取最新开奖结果失败:', error);
        const contentEl = document.getElementById('latestResultsContent');
        if (contentEl) {
            contentEl.innerHTML = `<div class="error">获取最新开奖结果失败: ${error.message}</div>`;
        }
    }
}

// 显示加载状态
function showLoadingState(elementId, show) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (show) {
        element.innerHTML = '<div class="loading"><div class="spinner"></div>正在加载...</div>';
    }
}

// 显示最新开奖结果 - 增强错误处理
function displayLatestResults(results) {
    const contentEl = document.getElementById('latestResultsContent');
    if (!contentEl) return;

    try {
        if (!results || !results.winning_numbers) {
            throw new Error('开奖数据格式错误');
        }

        const { front_zone = [], back_zone = [] } = results.winning_numbers;
        
        const frontNumbers = front_zone.map(num => 
            `<div class="number-ball front-number">${String(num).padStart(2, '0')}</div>`
        ).join('');
        
        const backNumbers = back_zone.map(num => 
            `<div class="number-ball back-number">${String(num).padStart(2, '0')}</div>`
        ).join('');
        
        const regions = results.regional_winners?.length > 0 
            ? results.regional_winners.slice(0, 3).map(region => region.province).join('、')
            : '暂无数据';
        
        const content = `
            <div style="text-align: center;">
                <h4>第${results.period || 'N/A'}期 (${results.draw_date || 'N/A'})</h4>
                <div class="winning-numbers">
                    ${frontNumbers}
                    <span style="margin: 0 10px; font-size: 1.5em;">+</span>
                    ${backNumbers}
                </div>
                <div class="prize-info">
                    <div class="prize-item">
                        <strong>销售总额</strong><br>${results.total_sales || '暂无数据'}
                    </div>
                    <div class="prize-item">
                        <strong>奖池金额</strong><br>${results.jackpot_info?.current_pool || '暂无数据'}
                    </div>
                    <div class="prize-item">
                        <strong>总中奖人数</strong><br>${results.statistics?.total_winners || 0}注
                    </div>
                    <div class="prize-item">
                        <strong>下期开奖</strong><br>${results.next_draw?.date || '暂无数据'}
                    </div>
                </div>
                <div style="margin-top: 15px; font-size: 0.9em;">
                    <strong>主要中奖地区:</strong> ${regions}
                </div>
            </div>
        `;
        
        contentEl.innerHTML = content;
    } catch (error) {
        console.error('显示开奖结果失败:', error);
        contentEl.innerHTML = `<div class="error">显示开奖结果失败: ${error.message}</div>`;
    }
}

// 数据分析功能 - 增强版
async function performDataAnalysis() {
    const resultEl = document.getElementById('analysisResults');
    const loadingEl = document.getElementById('analysisLoading');
    const contentEl = document.getElementById('analysisContent');
    
    if (!resultEl || !loadingEl || !contentEl) {
        console.error('找不到必要的DOM元素');
        return;
    }
    
    try {
        resultEl.style.display = 'block';
        loadingEl.style.display = 'block';
        contentEl.innerHTML = '';
        
        console.log('开始数据分析...');
        const data = await apiManager.makeRequest('/api/data-analysis');
        
        loadingEl.style.display = 'none';
        
        if (data && data.status === 'success' && data.analysis) {
            const analysis = data.analysis;
            contentEl.innerHTML = `
                <div class="success">数据分析完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>分析期数:</strong> ${analysis.total_draws || 'N/A'}</div>
                    <div class="analysis-item"><strong>更新时间:</strong> ${analysis.last_update || 'N/A'}</div>
                    <div class="analysis-item"><strong>前区热号:</strong> ${analysis.hot_numbers?.front?.join(', ') || 'N/A'}</div>
                    <div class="analysis-item"><strong>后区热号:</strong> ${analysis.hot_numbers?.back?.join(', ') || 'N/A'}</div>
                    <div class="analysis-item"><strong>前区冷号:</strong> ${analysis.cold_numbers?.front?.join(', ') || 'N/A'}</div>
                    <div class="analysis-item"><strong>后区冷号:</strong> ${analysis.cold_numbers?.back?.join(', ') || 'N/A'}</div>
                </div>
            `;
        } else {
            throw new Error(data?.message || '分析数据格式错误');
        }
    } catch (error) {
        console.error('数据分析失败:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `<div class="error">数据分析失败: ${error.message}</div>`;
    }
}

// AI预测功能 - 增强版
async function generateAIPrediction() {
    const resultEl = document.getElementById('predictionResults');
    const loadingEl = document.getElementById('predictionLoading');
    const contentEl = document.getElementById('predictionContent');
    
    if (!resultEl || !loadingEl || !contentEl) {
        console.error('找不到必要的DOM元素');
        return;
    }
    
    try {
        resultEl.style.display = 'block';
        loadingEl.style.display = 'block';
        contentEl.innerHTML = '';
        
        console.log('开始AI预测...');
        const data = await apiManager.makeRequest('/api/predict', {
            method: 'POST',
            body: JSON.stringify({
                prediction_type: 'ensemble',
                historical_data: []
            })
        });
        
        loadingEl.style.display = 'none';
        
        if (data && data.status === 'success' && data.prediction?.ensemble_prediction) {
            const prediction = data.prediction.ensemble_prediction;
            AppState.lastPrediction = prediction;
            
            contentEl.innerHTML = `
                <div class="success">AI预测完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>前区预测:</strong> ${prediction.front_zone?.join(', ') || 'N/A'}</div>
                    <div class="analysis-item"><strong>后区预测:</strong> ${prediction.back_zone?.join(', ') || 'N/A'}</div>
                    <div class="analysis-item"><strong>置信度:</strong> ${prediction.confidence ? (prediction.confidence * 100).toFixed(1) + '%' : 'N/A'}</div>
                    <div class="analysis-item"><strong>预测时间:</strong> ${new Date(data.timestamp).toLocaleString()}</div>
                </div>
                <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px; font-size: 0.9em;">
                    ⚠️ <strong>免责声明:</strong> 本预测仅供参考，请理性购彩，投注有风险。
                </div>
            `;
        } else {
            throw new Error(data?.message || '预测数据格式错误');
        }
    } catch (error) {
        console.error('AI预测失败:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `<div class="error">AI预测失败: ${error.message}</div>`;
    }
}

// 灵修因子功能 - 增强版
async function getSpiritualFactor() {
    const resultEl = document.getElementById('spiritualResults');
    const loadingEl = document.getElementById('spiritualLoading');
    const contentEl = document.getElementById('spiritualContent');
    
    if (!resultEl || !loadingEl || !contentEl) {
        console.error('找不到必要的DOM元素');
        return;
    }
    
    try {
        resultEl.style.display = 'block';
        loadingEl.style.display = 'block';
        contentEl.innerHTML = '';
        
        console.log('获取灵修因子...');
        const data = await apiManager.makeRequest('/api/spiritual');
        
        loadingEl.style.display = 'none';
        
        if (data && data.status === 'success' && data.spiritual_perturbation) {
            const spiritual = data.spiritual_perturbation;
            contentEl.innerHTML = `
                <div class="success">灵修因子获取成功</div>
                <div class="spiritual-factor">
                    <div><strong>混沌因子:</strong> ${spiritual.perturbation_factors?.chaos_factor || 'N/A'}</div>
                    <div><strong>和谐因子:</strong> ${spiritual.perturbation_factors?.harmony_factor || 'N/A'}</div>
                    <div><strong>宇宙调谐:</strong> ${spiritual.perturbation_factors?.cosmic_alignment || 'N/A'}</div>
                    <div><strong>能量等级:</strong> ${spiritual.perturbation_factors?.energy_level || 'N/A'}</div>
                    <div><strong>灵修图像:</strong> ${spiritual.spiritual_image?.description || 'N/A'}</div>
                    <div><strong>整体强度:</strong> ${spiritual.overall_intensity || 'N/A'}</div>
                    <div><strong>冥想建议:</strong> ${spiritual.spiritual_guidance?.recommended_mantra || 'N/A'}</div>
                    <div><strong>冥想时长:</strong> ${spiritual.spiritual_guidance?.meditation_time || 'N/A'}</div>
                </div>
            `;
        } else {
            throw new Error(data?.message || '灵修数据格式错误');
        }
    } catch (error) {
        console.error('获取灵修因子失败:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `<div class="error">获取灵修因子失败: ${error.message}</div>`;
    }
}

// 健康检查功能
async function performHealthCheck() {
    const resultEl = document.getElementById('healthResults');
    const loadingEl = document.getElementById('healthLoading');
    const contentEl = document.getElementById('healthContent');
    
    if (!resultEl || !loadingEl || !contentEl) {
        console.error('找不到必要的DOM元素');
        return;
    }
    
    try {
        resultEl.style.display = 'block';
        loadingEl.style.display = 'block';
        contentEl.innerHTML = '';
        
        console.log('执行健康检查...');
        const data = await apiManager.makeRequest('/api/health');
        
        loadingEl.style.display = 'none';
        
        if (data && data.status === 'healthy') {
            contentEl.innerHTML = `
                <div class="success">系统检查完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>系统状态:</strong> ${data.status}</div>
                    <div class="analysis-item"><strong>服务名称:</strong> ${data.service || 'N/A'}</div>
                    <div class="analysis-item"><strong>服务版本:</strong> ${data.version || 'N/A'}</div>
                    <div class="analysis-item"><strong>检查时间:</strong> ${new Date(data.timestamp).toLocaleString()}</div>
                </div>
            `;
        } else {
            throw new Error(data?.message || '系统状态异常');
        }
    } catch (error) {
        console.error('健康检查失败:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `<div class="error">健康检查失败: ${error.message}</div>`;
    }
}

// 生成分析报告 - 增强版
async function generateReport() {
    const currentPeriod = document.getElementById('currentPeriod')?.value || '24001';
    const lastPeriod = document.getElementById('lastPeriod')?.value || '23365';
    
    const resultEl = document.getElementById('reportResults');
    const loadingEl = document.getElementById('reportLoading');
    const contentEl = document.getElementById('reportContent');
    
    if (!resultEl || !loadingEl || !contentEl) {
        console.error('找不到必要的DOM元素');
        return;
    }
    
    try {
        resultEl.style.display = 'block';
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
        
        console.log('生成分析报告...');
        const data = await apiManager.makeRequest('/api/latest-results', {
            method: 'POST',
            body: JSON.stringify({
                current_period: currentPeriod,
                last_period: lastPeriod
            })
        });
        
        loadingEl.style.display = 'none';
        
        if (data && data.status === 'success' && data.report) {
            const markdownEl = document.getElementById('markdownContent');
            if (markdownEl) {
                markdownEl.textContent = data.report.content;
            }
            contentEl.style.display = 'block';
        } else {
            throw new Error(data?.message || '报告生成失败');
        }
    } catch (error) {
        console.error('报告生成失败:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `<div class="error">报告生成失败: ${error.message}</div>`;
    }
}

// 复制报告内容 - 增强版
function copyReport() {
    const contentEl = document.getElementById('markdownContent');
    if (!contentEl) {
        alert('找不到报告内容');
        return;
    }
    
    const content = contentEl.textContent;
    if (!content.trim()) {
        alert('报告内容为空');
        return;
    }
    
    // 现代浏览器优先使用Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
            showSuccessMessage('报告内容已复制到剪贴板！');
        }).catch(err => {
            console.error('现代复制API失败:', err);
            fallbackCopyTextToClipboard(content);
        });
    } else {
        fallbackCopyTextToClipboard(content);
    }
}

// 降级复制方法
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showSuccessMessage('报告内容已复制到剪贴板！');
        } else {
            showErrorMessage('复制失败，请手动选择内容复制');
        }
    } catch (err) {
        console.error('降级复制也失败了:', err);
        showErrorMessage('复制失败，请手动选择内容复制');
    }
    
    document.body.removeChild(textArea);
}

// 显示成功消息
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

// 显示错误消息
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// 通用通知函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        padding: 15px 20px; border-radius: 5px; color: white; font-weight: bold;
        max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            notification.innerHTML = `✅ ${message}`;
            break;
        case 'error':
            notification.style.background = '#dc3545';
            notification.innerHTML = `❌ ${message}`;
            break;
        default:
            notification.style.background = '#007bff';
            notification.innerHTML = `ℹ️ ${message}`;
    }
    
    document.body.appendChild(notification);
    
    // 滑入动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 错误边界处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    showErrorMessage(`系统错误: ${event.error?.message || '未知错误'}`);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    showErrorMessage(`异步错误: ${event.reason?.message || '未知错误'}`);
});

// 页面可见性API - 页面重新激活时检查系统状态
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && AppState.systemHealth !== 'healthy') {
        console.log('页面重新激活，检查系统状态');
        setTimeout(checkSystemHealth, 1000);
    }
});
