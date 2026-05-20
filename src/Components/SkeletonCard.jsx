/** Tarjeta skeleton para el estado de carga del catálogo */
export const SkeletonCard = () => (
    <div className="gd-card" style={{ padding: '1rem', overflow: 'hidden' }}>
        <div className="skeleton" style={{ width: '100%', height: '160px', borderRadius: '8px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '80%',  height: '18px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '55%',  height: '14px', marginBottom: '16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div className="skeleton" style={{ width: '70px', height: '26px', borderRadius: '20px' }} />
            <div className="skeleton" style={{ width: '80px', height: '26px', borderRadius: '20px' }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: '38px', borderRadius: '6px' }} />
    </div>
);
