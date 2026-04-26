

export function FluentiaProgressionVibe() {
    return (
        <div style={{
            background: 'linear-gradient(90deg, #fefefe 0%, #e8f9f7 100%)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '400px' }}>
                <div style={{
                    backgroundColor: '#ccf2ec',
                    color: '#008b7d',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginBottom: '15px',
                    letterSpacing: '1px'
                }}>
                    CURRENT PROGRESSION
                </div>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#1a1a1a',
                    margin: '0 0 15px 0'
                }}>
                    Level B2 French Mastery
                </h2>
                <p style={{
                    color: '#667788',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    You're making excellent progress! Narrative structures and dialectical nuance await your exploration.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#00a99d 0% 64%, #eaeaea 64% 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>64%</span>
                    </div>
                </div>
                <span style={{
                    marginTop: '15px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#666'
                }}>
                    Mastery Progress
                </span>
            </div>
        </div>
    );
}
