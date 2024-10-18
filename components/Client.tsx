import FormClient from "./FormClient";

const Client = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Client Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <FormClient />
      </div>
    </div>
  );
};

export default Client;
