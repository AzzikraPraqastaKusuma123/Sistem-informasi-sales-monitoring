import React from 'react';
import './DataTable.css';

const DataTable = ({ headers, data, onEdit, onDelete }) => {
  return (
    <div className="datatable-container">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {headers.map((header) => (
                  <td key={`${row.id}-${header.key}`}>
                    {row[header.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    <div className="action-buttons">
                      {onEdit && <button className="edit-btn" onClick={() => onEdit(row)}>Edit</button>}
                      {onDelete && <button className="delete-btn" onClick={() => onDelete(row)}>Hapus</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + ((onEdit || onDelete) ? 1: 0)} style={{ textAlign: 'center' }}>
                Tidak ada data tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;