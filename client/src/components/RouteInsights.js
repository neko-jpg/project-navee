// client/src/components/RouteInsights.js
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Clock, Route, TrendingUp, MapPin } from 'lucide-react';
import '../styles/RouteInsights.css';

function RouteInsights({ routeData, activeZones, isVisible }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (routeData && isVisible) {
      generateInsights();
    }
  }, [routeData, activeZones, isVisible]);

  const generateInsights = async () => {
    setIsLoading(true);
    
    // シミュレートされたAI分析（実際のGemini APIの代替）
    setTimeout(() => {
      const safetyScore = calculateSafetyScore();
      const recommendations = generateRecommendations(safetyScore);
      
      setInsights({
        safetyScore,
        recommendations,
        riskFactors: analyzeRiskFactors(),
        routeComparison: compareRoutes()
      });
      setIsLoading(false);
    }, 1500);
  };

  const calculateSafetyScore = () => {
    if (!routeData || !routeData.naveeRoute) return 0;
    
    const baseScore = 85;
    const dangerZonePenalty = (activeZones?.length || 0) * 5;
    const routeTypeBenefit = routeData.naveeRoute.summary.includes('国道') ? 10 : 5;
    
    return Math.max(0, Math.min(100, baseScore - dangerZonePenalty + routeTypeBenefit));
  };

  const generateRecommendations = (score) => {
    const recommendations = [];
    
    if (score >= 90) {
      recommendations.push({
        type: 'success',
        icon: Shield,
        title: '最適な安全ルート',
        description: 'このルートは大通り中心で、危険地点を効果的に回避しています。'
      });
    } else if (score >= 70) {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: '注意が必要な区間があります',
        description: '一部危険地点を通過しますが、全体的には安全なルートです。'
      });
    } else {
      recommendations.push({
        type: 'danger',
        icon: AlertTriangle,
        title: '代替ルートを検討してください',
        description: '複数の危険地点を通過するため、時間に余裕があれば別ルートをお勧めします。'
      });
    }

    if (activeZones && activeZones.length > 0) {
      recommendations.push({
        type: 'info',
        icon: MapPin,
        title: `${activeZones.length}箇所の危険地点を特定`,
        description: '事故多発交差点や狭隘路を事前に把握し、注意深い運転を心がけましょう。'
      });
    }

    return recommendations;
  };

  const analyzeRiskFactors = () => {
    return [
      { factor: '大通り利用率', value: 78, status: 'good' },
      { factor: '危険地点回避', value: 85, status: 'excellent' },
      { factor: '交通量予測', value: 65, status: 'moderate' },
      { factor: '道路状況', value: 90, status: 'excellent' }
    ];
  };

  const compareRoutes = () => {
    if (!routeData) return null;
    
    return {
      navee: {
        distance: routeData.naveeRoute?.legs[0]?.distance?.text || 'N/A',
        duration: routeData.naveeRoute?.legs[0]?.duration?.text || 'N/A',
        safetyScore: calculateSafetyScore(),
        advantages: ['危険地点回避', '大通り優先', '車種最適化']
      },
      google: {
        distance: routeData.googleRoute?.legs[0]?.distance?.text || 'N/A',
        duration: routeData.googleRoute?.legs[0]?.duration?.text || 'N/A',
        safetyScore: Math.max(0, calculateSafetyScore() - 15),
        advantages: ['最短距離', '所要時間短縮']
      }
    };
  };

  if (!isVisible) return null;

  return (
    <div className="route-insights">
      <div className="insights-header">
        <TrendingUp className="header-icon" />
        <h3>AI安全分析レポート</h3>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>AIがルートを分析中...</p>
        </div>
      ) : insights ? (
        <div className="insights-content">
          {/* 安全スコア */}
          <div className="safety-score-card">
            <div className="score-circle">
              <div className="score-value">{insights.safetyScore}</div>
              <div className="score-label">安全スコア</div>
            </div>
            <div className="score-description">
              <h4>総合評価</h4>
              <p>
                {insights.safetyScore >= 90 ? '非常に安全' :
                 insights.safetyScore >= 70 ? '安全' :
                 insights.safetyScore >= 50 ? '注意が必要' : '危険'}
              </p>
            </div>
          </div>

          {/* 推奨事項 */}
          <div className="recommendations">
            <h4>AI推奨</h4>
            {insights.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation ${rec.type}`}>
                <rec.icon className="rec-icon" />
                <div className="rec-content">
                  <h5>{rec.title}</h5>
                  <p>{rec.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* リスク要因分析 */}
          <div className="risk-analysis">
            <h4>詳細分析</h4>
            {insights.riskFactors.map((factor, index) => (
              <div key={index} className="risk-factor">
                <div className="factor-info">
                  <span className="factor-name">{factor.factor}</span>
                  <span className={`factor-status ${factor.status}`}>
                    {factor.value}%
                  </span>
                </div>
                <div className="factor-bar">
                  <div 
                    className={`factor-progress ${factor.status}`}
                    style={{ width: `${factor.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* ルート比較 */}
          {insights.routeComparison && (
            <div className="route-comparison">
              <h4>ルート比較</h4>
              <div className="comparison-grid">
                <div className="route-card navee">
                  <div className="route-header">
                    <Shield className="route-icon" />
                    <span>NAVee推奨</span>
                  </div>
                  <div className="route-stats">
                    <div className="stat">
                      <Clock className="stat-icon" />
                      <span>{insights.routeComparison.navee.duration}</span>
                    </div>
                    <div className="stat">
                      <Route className="stat-icon" />
                      <span>{insights.routeComparison.navee.distance}</span>
                    </div>
                    <div className="safety-badge">
                      安全度: {insights.routeComparison.navee.safetyScore}%
                    </div>
                  </div>
                  <div className="advantages">
                    {insights.routeComparison.navee.advantages.map((adv, i) => (
                      <span key={i} className="advantage-tag">{adv}</span>
                    ))}
                  </div>
                </div>

                <div className="route-card google">
                  <div className="route-header">
                    <AlertTriangle className="route-icon" />
                    <span>Google推奨</span>
                  </div>
                  <div className="route-stats">
                    <div className="stat">
                      <Clock className="stat-icon" />
                      <span>{insights.routeComparison.google.duration}</span>
                    </div>
                    <div className="stat">
                      <Route className="stat-icon" />
                      <span>{insights.routeComparison.google.distance}</span>
                    </div>
                    <div className="safety-badge warning">
                      安全度: {insights.routeComparison.google.safetyScore}%
                    </div>
                  </div>
                  <div className="advantages">
                    {insights.routeComparison.google.advantages.map((adv, i) => (
                      <span key={i} className="advantage-tag">{adv}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default RouteInsights;