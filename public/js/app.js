// API基础配置 - 修复路径问题
const API_BASE = window.location.origin;

// 页面加载时获取最新开奖结果
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    loadLatestResults();
    checkSystemHealth();
});

// 系统健康检查
async function checkSystemHealth() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        console.log('系统状态:', data);
        
        const statusEl = document.querySelector('.status-bar');
        if (statusEl) {
            if (data.status === 'healthy') {
                statusEl.innerHTML = '<div class="status-indicator"></div>系统运行正常';
                statusEl.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
            } else {
                statusEl.innerHTML = '<div class="status-indicator" style="background: #f56565;"></div>系统异常';
                statusEl.style.background = 'linear-gradient(90deg, #f56565, #e53e3e)';
            }
        }
    } catch (error) {
        console.error('健康检查失败:', error);
        const statusEl = document.querySelector('.status-bar');
        if (statusEl) {
            statusEl.innerHTML = '<div class="status-indicator" style="background: #f56565;"></div>无法连接到API服务';
            statusEl.style.background = 'linear-gradient(90deg, #f56565, #e53e3e)';
        }
    }
}

// 获取最新开奖结果
async function loadLatestResults() {
    try {
        console.log('正在获取最新开奖结果...');
        const loadingElement = document.querySelector('#latestResultsContent .loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        const response = await fetch(`${API_BASE}/api/latest-results`);
        const data = await response.json();
        
        if (data.status === 'success') {
            displayLatestResults(data.latest_results);
        } else {
            throw new Error(data.message || '获取数据失败');
        }
    } catch (error) {
        console.error('获取最新开奖结果失败:', error);
        document.getElementById('latestResultsContent').innerHTML = 
            `<div class="error">获取最新开奖结果失败: ${error.message}</div>`;
    }
}

// 显示最新开奖结果
function displayLatestResults(results) {
    if (!results || !results.winning_numbers) {
        document.getElementById('latestResultsContent').innerHTML = 
            '<div class="error">开奖数据格式错误</div>';
        return;
    }

    const frontNumbers = results.winning_numbers.front_zone.map(num => 
        `<div class="number-ball front-number">${num.toString().padStart(2, '0')}</div>`
    ).join('');
    
    const backNumbers = results.winning_numbers.back_zone.map(num => 
        `<div class="number-ball back-number">${num.toString().padStart(2, '0')}</div>`
    ).join('');
    
    const regions = results.regional_winners && results.regional_winners.length > 0 
        ? results.regional_winners.slice(0, 3).map(region => region.province).join('、')
        : '暂无数据';
    
    const content = `
        <div style="text-align: center;">
            <h4>第${results.period}期 (${results.draw_date})</h4>
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
    
    document.getElementById('latestResultsContent').innerHTML = content;
}

// 数据分析功能 - 修复API调用
async function performDataAnalysis() {
    const resultsDiv = document.getElementById('analysisResults');
    const loadingDiv = document.getElementById('analysisLoading');
    const contentDiv = document.getElementById('analysisContent');
    
    resultsDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = '';
    
    try {
        console.log('开始数据分析...');
        const response = await fetch(`${API_BASE}/api/data-analysis`);
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.status === 'success') {
            const analysis = data.analysis;
            contentDiv.innerHTML = `
                <div class="success">数据分析完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>分析期数:</strong> ${analysis.total_draws}</div>
                    <div class="analysis-item"><strong>更新时间:</strong> ${analysis.last_update}</div>
                    <div class="analysis-item"><strong>前区热号:</strong> ${analysis.hot_numbers.front.join(', ')}</div>
                    <div class="analysis-item"><strong>后区热号:</strong> ${analysis.hot_numbers.back.join(', ')}</div>
                    <div class="analysis-item"><strong>前区冷号:</strong> ${analysis.cold_numbers.front.join(', ')}</div>
                    <div class="analysis-item"><strong>后区冷号:</strong> ${analysis.cold_numbers.back.join(', ')}</div>
                </div>
            `;
        } else {
            throw new Error(data.message || '分析失败');
        }
    } catch (error) {
        console.error('数据分析失败:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `<div class="error">数据分析失败: ${error.message}</div>`;
    }
}

// AI预测功能 - 修复API调用
async function generateAIPrediction() {
    const resultsDiv = document.getElementById('predictionResults');
    const loadingDiv = document.getElementById('predictionLoading');
    const contentDiv = document.getElementById('predictionContent');
    
    resultsDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = '';
    
    try {
        console.log('开始AI预测...');
        const response = await fetch(`${API_BASE}/api/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prediction_type: 'ensemble',
                historical_data: []
            })
        });
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.status === 'success') {
            const prediction = data.prediction.ensemble_prediction;
            contentDiv.innerHTML = `
                <div class="success">AI预测完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>前区预测:</strong> ${prediction.front_zone.join(', ')}</div>
                    <div class="analysis-item"><strong>后区预测:</strong> ${prediction.back_zone.join(', ')}</div>
                    <div class="analysis-item"><strong>置信度:</strong> ${(prediction.confidence * 100).toFixed(1)}%</div>
                    <div class="analysis-item"><strong>预测时间:</strong> ${new Date(data.timestamp).toLocaleString()}</div>
                </div>
            `;
        } else {
            throw new Error(data.message || '预测失败');
        }
    } catch (error) {
        console.error('AI预测失败:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `<div class="error">AI预测失败: ${error.message}</div>`;
    }
}

// 灵修因子功能 - 修复API调用
async function getSpiritualFactor() {
    const resultsDiv = document.getElementById('spiritualResults');
    const loadingDiv = document.getElementById('spiritualLoading');
    const contentDiv = document.getElementById('spiritualContent');
    
    resultsDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = '';
    
    try {
        console.log('获取灵修因子...');
        const response = await fetch(`${API_BASE}/api/spiritual`);
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.status === 'success') {
            const spiritual = data.spiritual_perturbation;
            contentDiv.innerHTML = `
                <div class="success">灵修因子获取成功</div>
                <div class="spiritual-factor">
                    <div><strong>混沌因子:</strong> ${spiritual.perturbation_factors.chaos_factor}</div>
                    <div><strong>和谐因子:</strong> ${spiritual.perturbation_factors.harmony_factor}</div>
                    <div><strong>宇宙调谐:</strong> ${spiritual.perturbation_factors.cosmic_alignment}</div>
                    <div><strong>能量等级:</strong> ${spiritual.perturbation_factors.energy_level}</div>
                    <div><strong>灵修图像:</strong> ${spiritual.spiritual_image.description}</div>
                    <div><strong>整体强度:</strong> ${spiritual.overall_intensity}</div>
                    <div><strong>冥想建议:</strong> ${spiritual.spiritual_guidance.recommended_mantra}</div>
                </div>
            `;
        } else {
            throw new Error(data.message || '获取失败');
        }
    } catch (error) {
        console.error('获取灵修因子失败:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `<div class="error">获取灵修因子失败: ${error.message}</div>`;
    }
}

// 健康检查功能
async function performHealthCheck() {
    const resultsDiv = document.getElementById('healthResults');
    const loadingDiv = document.getElementById('healthLoading');
    const contentDiv = document.getElementById('healthContent');
    
    resultsDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = '';
    
    try {
        console.log('执行健康检查...');
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.status === 'healthy') {
            contentDiv.innerHTML = `
                <div class="success">系统检查完成</div>
                <div class="analysis-results">
                    <div class="analysis-item"><strong>系统状态:</strong> ${data.status}</div>
                    <div class="analysis-item"><strong>服务名称:</strong> ${data.service}</div>
                    <div class="analysis-item"><strong>服务版本:</strong> ${data.version}</div>
                    <div class="analysis-item"><strong>检查时间:</strong> ${new Date(data.timestamp).toLocaleString()}</div>
                </div>
            `;
        } else {
            throw new Error('系统状态异常');
        }
    } catch (error) {
        console.error('健康检查失败:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `<div class="error">健康检查失败: ${error.message}</div>`;
    }
}

// 生成分析报告
async function generateReport() {
    const currentPeriod = document.getElementById('currentPeriod').value || '24001';
    const lastPeriod = document.getElementById('lastPeriod').value || '23365';
    
    const resultsDiv = document.getElementById('reportResults');
    const loadingDiv = document.getElementById('reportLoading');
    const contentDiv = document.getElementById('reportContent');
    
    resultsDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    
    try {
        console.log('生成分析报告...');
        const response = await fetch(`${API_BASE}/api/latest-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_period: currentPeriod,
                last_period: lastPeriod
            })
        });
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.status === 'success' && data.report) {
            document.getElementById('markdownContent').textContent = data.report.content;
            contentDiv.style.display = 'block';
        } else {
            throw new Error(data.message || '报告生成失败');
        }
    } catch (error) {
        console.error('报告生成失败:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `<div class="error">报告生成失败: ${error.message}</div>`;
    }
}

// 复制报告内容
function copyReport() {
    const content = document.getElementById('markdownContent').textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(function() {
            alert('报告内容已复制到剪贴板！');
        }).catch(function(err) {
            console.error('复制失败:', err);
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
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('报告内容已复制到剪贴板！');
        } else {
            alert('复制失败，请手动选择内容复制');
        }
    } catch (err) {
        console.error('降级复制也失败了:', err);
        alert('复制失败，请手动选择内容复制');
    }
    
    document.body.removeChild(textArea);
}
