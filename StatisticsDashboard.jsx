import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../services/api';

const StatisticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchStatistics();
      setStats(data);
    } catch (err) {
      setError('Could not load statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <div className="text-center py-5">No data available</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Statistics Dashboard</h2>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Entries</h5>
              <h2>{stats.totalEntries || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Quantity (kg)</h5>
              <h2>{(stats.totalQuantity || 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Families</h5>
              <h2>{stats.totalFamilies || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Recycled (kg)</h5>
              <h2>{(stats.statusQuantity?.RECYCLED || 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Status Breakdown</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <span className="badge bg-warning">Pending</span>
                  <strong className="ms-2">{stats.pendingEntries || 0}</strong>
                </li>
                <li className="mb-2">
                  <span className="badge bg-info">Processing</span>
                  <strong className="ms-2">{stats.processingEntries || 0}</strong>
                </li>
                <li className="mb-2">
                  <span className="badge bg-success">Recycled</span>
                  <strong className="ms-2">{stats.recycledEntries || 0}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Waste Type Breakdown */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Waste by Type</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Waste Type</th>
                      <th>Count</th>
                      <th>Quantity (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.wasteTypeCount && Object.entries(stats.wasteTypeCount).map(([type, count]) => (
                      <tr key={type}>
                        <td><strong>{type}</strong></td>
                        <td>{count}</td>
                        <td>{(stats.wasteTypeQuantity?.[type] || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Quantity */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Quantity by Status (kg)</h5>
          <div className="row text-center">
            <div className="col-md-4">
              <h6 className="text-warning">Pending</h6>
              <h4>{(stats.statusQuantity?.PENDING || 0).toFixed(2)}</h4>
            </div>
            <div className="col-md-4">
              <h6 className="text-info">Processing</h6>
              <h4>{(stats.statusQuantity?.PROCESSING || 0).toFixed(2)}</h4>
            </div>
            <div className="col-md-4">
              <h6 className="text-success">Recycled</h6>
              <h4>{(stats.statusQuantity?.RECYCLED || 0).toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={loadStatistics}>
        🔄 Refresh
      </button>
    </div>
  );
};

export default StatisticsDashboard;
