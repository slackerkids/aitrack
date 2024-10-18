const Doctor = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h3 className="card-title">Appointments</h3>
            <p>You have 5 appointments today</p>
          </div>
        </div>
        <div className="card bg-secondary text-secondary-content">
          <div className="card-body">
            <h3 className="card-title">Patients</h3>
            <p>You have 20 active patients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
