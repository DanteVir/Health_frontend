import React, { useReducer } from 'react';

const initialState = {
  pendienteSubtareas: [],
  procesoSubtareas: [],
  finalizadasSubtareas: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'MOVER_PENDIENTE':
      return {
        ...state,
        pendienteSubtareas: [
          ...state.pendienteSubtareas,
          action.payload.subtarea,
        ],
        procesoSubtareas: state.procesoSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
        finalizadasSubtareas: state.finalizadasSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
      };
    case 'MOVER_PROCESO':
      return {
        ...state,
        pendienteSubtareas: state.pendienteSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
        procesoSubtareas: [
          ...state.procesoSubtareas,
          action.payload.subtarea,
        ],
        finalizadasSubtareas: state.finalizadasSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
      };
    case 'MOVER_FINALIZADA':
      return {
        ...state,
        pendienteSubtareas: state.pendienteSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
        procesoSubtareas: state.procesoSubtareas.filter(
          (s) => s.descripcion !== action.payload.subtarea.descripcion
        ),
        finalizadasSubtareas: [
          ...state.finalizadasSubtareas,
          action.payload.subtarea,
        ],
      };
    default:
      throw new Error('Acción no reconocida');
  }
}

export const Cliente = ({ email, citas }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Maneja el evento dragover para permitir el drop en un área de destino.
   * @param {DragEvent} e - El evento de arrastrar sobre un elemento.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /**
   * Maneja el evento drop cuando se suelta un elemento arrastrable en un área de destino.
   * @param {DragEvent} e - El evento de soltar un elemento.
   * @param {string} estado - El estado al que se moverá la subtarea ('pendiente', 'proceso' o 'finalizada').
   */
  const handleDrop = (e, estado) => {
    e.preventDefault();
    const subtareaData = e.dataTransfer.getData('text/plain');
    const subtarea = JSON.parse(subtareaData);

    // Validar que la subtarea tenga una descripción válida
    if (!subtarea.descripcion || typeof subtarea.descripcion !== 'string') {
      console.error('La subtarea no tiene una descripción válida');
      return;
    }

    // Mover la subtarea al estado correspondiente
    switch (estado) {
      case 'pendiente':
        dispatch({ type: 'MOVER_PENDIENTE', payload: { subtarea } });
        break;
      case 'proceso':
        dispatch({ type: 'MOVER_PROCESO', payload: { subtarea } });
        break;
      case 'finalizada':
        dispatch({ type: 'MOVER_FINALIZADA', payload: { subtarea } });
        break;
      default:
        console.error('Estado de subtarea no reconocido');
    }
  };

  return (
    <div>
      <h2>Citas de {email}</h2>
      <ul>
        {/* Renderizar citas y subtareas */}
        {Array.isArray(citas) && citas.length > 0 ? (
          citas.map((cita, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-md mb-4 shadow-md flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-semibold">Cita: {cita.cita}</p>
                <p className="text-gray-600">Descripción: {cita.descripcion}</p>
                <p className="text-gray-600">Fecha: {cita.fecha}</p>
                <p className="text-gray-600">Hora: {cita.hora}</p>
                <p className="text-gray-600">Paciente: {cita.paciente}</p>
                {/* Renderizar subtareas pendientes */}
                {state.pendienteSubtareas.length > 0 && (
                  <div>
                    <h3>Subtareas pendientes:</h3>
                    <ul>
                      {state.pendienteSubtareas.map((subtarea, index) => (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify(subtarea)
                            )
                          }
                        >
                          {subtarea.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Renderizar subtareas en proceso */}
                {state.procesoSubtareas.length > 0 && (
                  <div>
                    <h3>Subtareas en proceso:</h3>
                    <ul>
                      {state.procesoSubtareas.map((subtarea, index) => (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify(subtarea)
                            )
                          }
                        >
                          {subtarea.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Renderizar subtareas finalizadas */}
                {state.finalizadasSubtareas.length > 0 && (
                  <div>
                    <h3>Subtareas finalizadas:</h3>
                    <ul>
                      {state.finalizadasSubtareas.map((subtarea, index) => (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify(subtarea)
                            )
                          }
                        >
                          {subtarea.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 mr-2"
                  onClick={() => deleteCita(index)}
                >
                  Borrar
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 mr-2"
                  onClick={() => moveCitaUp(index)}
                  disabled={index === 0}
                >
                  Subir
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                  onClick={() => moveCitaDown(index)}
                  disabled={index === citas.length - 1}
                >
                  Bajar
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No hay citas agendadas</li>
        )}
      </ul>
 
      {/* Áreas de destino para soltar subtareas */}
      <div>
        <h3>Pendientes</h3>
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'pendiente')}
          style={{ border: '1px solid black', padding: '10px' }}
        >
          Soltar aquí para mover a pendientes
        </div>
      </div>
 
      <div>
        <h3>En Proceso</h3>
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'proceso')}
          style={{ border: '1px solid black', padding: '10px' }}
        >
          Soltar aquí para mover a en proceso
        </div>
      </div>
 
      <div>
        <h3>Finalizadas</h3>
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'finalizada')}
          style={{ border: '1px solid black', padding: '10px' }}
        >
          Soltar aquí para mover a finalizadas
        </div>
      </div>
    </div>
  );
 };