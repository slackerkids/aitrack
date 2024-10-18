const Client = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Client Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-accent text-accent-content">
          <div className="card-body">
            <h3 className="card-title">Upcoming Appointments</h3>
            <p>You have 2 upcoming appointments</p>
          </div>
        </div>
        <div className="card bg-neutral text-neutral-content">
          <div className="card-body">
            <h3 className="card-title">Medical Records</h3>
            <p>Last updated: 2 weeks ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
