import { ReactElement } from "react";

interface BinderProps {
  id: number;
  event: string;
  type: string;
  division: string;
}

export default function Binder({
  event,
  type,
  division,
  id,
}: BinderProps): ReactElement {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="px-4 pt-4">
        <img
          // Eventually replace this with a real image
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt={`${event} binder`}
          className="rounded-xl object-cover h-48 w-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">
          <a href={`binder/${id}`}>{event}</a>
        </h2>
        <div className="flex justify-between items-center mt-2">
          <div>
            <div className="badge badge-secondary p-3 mr-1">{type}</div>
            <div className="badge badge-accent p-3">Div {division}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.href = `binder/${id}`}>Open</button>
        </div>
      </div>
    </div>
  );
}
