
import { BookOpen, Headphones, PenTool, Mic } from 'lucide-react';

export function FluentiaDashboardVibe() {
    return (
        <div style={{ backgroundColor: '#f9fafb', padding: '30px', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <div style={{ color: '#008b7d', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '5px' }}>STUDENT PERFORMANCE</div>
                    <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold', color: '#111' }}>Fluentia Mastery</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ background: '#f0f0f0', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', color: '#555', cursor: 'pointer' }}>Export Report</button>
                    <button style={{ background: '#00a99d', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}>Retake Assessment</button>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div style={{ display: 'flex', gap: '25px', marginBottom: '25px' }}>
                {/* Left Big Card */}
                <div style={{ flex: '1', backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px' }}>PREDICTED BAND SCORE</div>
                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(#00a99d 0% 83%, #eaeaea 83% 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ width: '135px', height: '135px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#111', lineHeight: '1' }}>7.5</span>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#00a99d', letterSpacing: '1px', marginTop: '5px' }}>EXPERT USER</span>
                        </div>
                    </div>
                    <div style={{ background: '#ecfdf5', color: '#008b7d', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        ↗ +0.5 from last assessment
                    </div>
                </div>

                {/* Right Grid */}
                <div style={{ flex: '2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {[
                        { title: 'Reading', sub: 'Academic & General', score: '8.0', icon: <BookOpen size={20} color="#008b7d" />, progress: 90 },
                        { title: 'Listening', sub: 'Interactive Audio', score: '7.5', icon: <Headphones size={20} color="#008b7d" />, progress: 80 },
                        { title: 'Writing', sub: 'Cohesion & Lexical', score: '6.5', icon: <PenTool size={20} color="#008b7d" />, progress: 65 },
                        { title: 'Speaking', sub: 'Fluency & Pronunciation', score: '7.0', icon: <Mic size={20} color="#008b7d" />, progress: 75 },
                    ].map((item, i) => (
                        <div key={i} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfdf5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>{item.title}</div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{item.sub}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111' }}>{item.score}</div>
                                <div style={{ width: '40px', height: '4px', backgroundColor: '#eaeaea', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: '#00a99d' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Chart */}
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', margin: '0 0 5px 0', color: '#111' }}>Historical Progression</h2>
                        <div style={{ color: '#888', fontSize: '13px' }}>Last 30 days performance across all modules</div>
                    </div>
                    <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '20px', padding: '4px' }}>
                        <button style={{ background: '#fff', border: 'none', padding: '6px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: '#111' }}>1 Month</button>
                        <button style={{ background: 'transparent', border: 'none', padding: '6px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: '#888' }}>3 Months</button>
                        <button style={{ background: 'transparent', border: 'none', padding: '6px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: '#888' }}>All Time</button>
                    </div>
                </div>
                
                {/* Fake Chart */}
                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px' }}>
                    {[10, 20, 30, 25, 45, 60, 55, 35, 15, 80].map((h, i) => (
                        <div key={i} style={{ width: '8%', height: `${h}%`, backgroundColor: i === 9 ? '#008b7d' : '#80d4ce', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: '-15px', left: '0', width: '100%', height: '100%', backgroundColor: '#eaeaea', zIndex: -1, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', opacity: 0.5 }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
