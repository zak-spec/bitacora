import axios from './Axios.js';

export const exportFormatoCSV = async (id) => {
  try {
    const response = await axios.get(`/task/csv/${id}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    });
    
    // Obtener el nombre del archivo del header
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `bitacora_${id}.csv`;

    // Crear y descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
};

export const exportFormatoPDF = async (id) => {
  try {
    const response = await axios.get(`/task/pdf/${id}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    // Obtener el nombre del archivo del header
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `bitacora_${id}.pdf`;

    // Crear y descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw error;
  }
};
