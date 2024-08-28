import { ReactElement, useEffect, useState } from 'react';

interface BinderProps {
  id: number;
  event: string;
  type: string;
  division: string;
}

export default function Binder({ event, type, division, id }: BinderProps): ReactElement {
  const [displayImage, setDisplayImage] = useState('');
  useEffect(() => {
    const fetchBinderImage = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found in localStorage');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/get_binder_image/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setDisplayImage(imageUrl);
      } catch (error) {
        console.error('Error fetching binder image:', error);
      }
    };

    fetchBinderImage();

    // Cleanup function to revoke the object URL
    return () => {
      if (displayImage) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [id]); // Add id to the dependency array
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="px-4 pt-4">
      {displayImage && <img src={displayImage} alt="Binder" className="rounded-xl object-cover h-48 w-full" />}
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
          <button
            className="btn btn-primary btn-sm"
            onClick={() => (window.location.href = `binder/${id}`)}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
