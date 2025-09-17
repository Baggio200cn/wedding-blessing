// 大乐透预测系统 - 前端脚本
console.log('系统初始化...');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    checkSystemHealth();
});

// 系统健康检查
async function checkSystemHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('系统状态:', data);
        
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            if (data.status === 'healthy') {
                statusEl.innerHTML = '<span class="status-indicator status-healthy"></span>系统运行正常';
            } else {
                statusEl.innerHTML = '<span class="status-indicator status-error"></span>系统异常';
            }
        }
    } catch (error) {
        console.error('健康检查失败:', error);
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            statusEl.innerHTML = '<span class="status-indicator status-error"></span>无法连接到API服务';
        }
    }
}

// 数据分析函数
async function analyzeData() {
    console.log('开始数据分析...');
    const resultEl = document.getElementById('analysis-result');
    if (resultEl) {
        resultEl.innerHTML = '<p>正在分析数据...</p>';
        
        try {
            const response = await fetch('/api/data-analysis');
            const data = await response.json();
            
            if (data.status === 'success') {
                resultEl.innerHTML = '<h3>分析完成</h3><pre>' + JSON.stringify(data.analysis, null, 2) + '</pre>';
            } else {
                resultEl.innerHTML = '<p>分析失败: ' + data.message + '</p>';
            }
        } catch (error) {
            resultEl.innerHTML = '<p>请求失败: ' + error.message + '</p>';
        }
    }
}

// AI预测函数
async function predict() {
    console.log('开始AI预测...');
    const resultEl = document.getElementById('prediction-result');
    if (resultEl) {
        resultEl.innerHTML = '<p>AI正在思考...</p>';
        
        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ prediction_type: 'all' })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                const pred = data.prediction.ensemble_prediction;
                resultEl.innerHTML = 
                    '<h3>AI预测结果</h3>' +
                    '<p>前区: ' + pred.front_zone.join(', ') + '</p>' +
                    '<p>后区: ' + pred.back_zone.join(', ') + '</p>' +
                    '<p>置信度: ' + (pred.confidence * 100).toFixed(1) + '%</p>';
            } else {
                resultEl.innerHTML = '<p>预测失败: ' + data.message + '</p>';
            }
        } catch (error) {
            resultEl.innerHTML = '<p>请求失败: ' + error.message + '</p>';
        }
    }
}

// 其他占位函数
function getSpiritualPerturbation() {
    console.log('获取灵修扰动...');
    const resultEl = document.getElementById('spiritual-result');
    if (resultEl) {
        resultEl.innerHTML = '<p>灵修扰动功能开发中...</p>';
    }
}

function getSystemHealth() {
    console.log('系统健康检查...');
    checkSystemHealth();
}
