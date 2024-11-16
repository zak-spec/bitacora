import React, { useState, useEffect } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import "./TasksFormPage.css"
import { useTasks } from '../../Context/TasksContex'
import { useForm } from 'react-hook-form';
import { uploadFile } from '../../Firebase/Config';
import { useAuth } from '../../Context/AuthContext';
import { set } from 'mongoose';


const TasksFormPage = () => {
  const {loading} = useAuth();
  const {createTasks,getTask,updateTask } = useTasks()
  // const [File, setFile] = useState([])
  const [samplingFiles, setSamplingFiles] = useState([]);
  const [speciesFiles, setSpeciesFiles] = useState([]); // Añadir este estado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const { register, handleSubmit: handleReactHookFormSubmit, formState: { errors },setValue } = useForm({
    defaultValues: {
      title: '',
      samplingDateTime: new Date().toISOString().slice(0, 16),
      weatherConditions: '',
      habitatDescription: '',
      additionalObservations: '',
      speciesDetails: [{
        scientificName: '',
        commonName: '',
        family: '',
        sampleQuantity: 0,
        plantState: '',
        speciesPhotos: []
      }]
    }
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        setValue('title', task.title);
        setValue('samplingDateTime', new Date(task.samplingDateTime).toISOString().slice(0, 16));
        setValue('weatherConditions', task.weatherConditions);
        setValue('habitatDescription', task.habitatDescription);
        setValue('additionalObservations', task.additionalObservations);
        setValue('speciesDetails', task.speciesDetails);
        
        // Guardar las URLs de las fotos existentes
        setSamplingFiles(task.samplingPhotos || []);
        if (task.speciesDetails) {
          setSpeciesFiles(task.speciesDetails.map(species => species.speciesPhotos || []));
        }
        
        setFormData(prev => ({
          ...prev,
          ...task,
          samplingDateTime: new Date(task.samplingDateTime).toISOString().slice(0, 16)
        }));
      } else {
        // Limpiar el formulario cuando no hay ID
        setValue('title', '');
        setValue('samplingDateTime', new Date().toISOString().slice(0, 16));
        setValue('weatherConditions', '');
        setValue('habitatDescription', '');
        setValue('additionalObservations', '');
        setValue('speciesDetails', [{
          scientificName: '',
          commonName: '',
          family: '',
          sampleQuantity: 0,
          plantState: '',
          speciesPhotos: []
        }]);
        
        setSamplingFiles([]);
        setSpeciesFiles([[]]);
        
        setFormData({
          title: '',
          samplingDateTime: new Date().toISOString().slice(0, 16),
          location: {
            latitude: '',
            longitude: ''
          },
          weatherConditions: '',
          habitatDescription: '',
          samplingPhotos: [],
          speciesDetails: [{
            scientificName: '',
            commonName: '',
            family: '',
            sampleQuantity: 0,
            plantState: '',
            speciesPhotos: []
          }],
          additionalObservations: ''
        });
      }
    }
    loadTask();
  }, [params.id, setValue, getTask]);


  if(loading) return <h1>Cargando...</h1>;

  const navigate = useNavigate()



  const [formData, setFormData] = useState({
    title: '',
    samplingDateTime: new Date().toISOString().slice(0, 16),
    location: {
      latitude: '',
      longitude: ''
    },
    weatherConditions: '',
    habitatDescription: '',
    samplingPhotos: [],
    speciesDetails: [{
      scientificName: '',
      commonName: '',
      family: '',
      sampleQuantity: 0,
      plantState: '',
      speciesPhotos: []
    }],
    additionalObservations: ''
  });

  useEffect(() => {
    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => console.error(error)
      );
    }
  }, []);


  const uploadAllFiles = async (files) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return [];
    }
    const uploadPromises = files.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  };

  const onSubmit = handleReactHookFormSubmit(async (formValues, event) => {
    try {
      setIsSubmitting(true);
      
      if (params.id) {
        const processedFormValues = {
          ...formValues,
          samplingDateTime: new Date(formValues.samplingDateTime).toISOString(),
          location: {
            latitude: Number(formData.location.latitude),
            longitude: Number(formData.location.longitude)
          },
          // Mantener las fotos existentes si no hay nuevas
          samplingPhotos: Array.isArray(samplingFiles) && samplingFiles.length > 0 ? 
            (typeof samplingFiles[0] === 'string' ? samplingFiles : await uploadAllFiles(samplingFiles)) : 
            [],
          speciesDetails: await Promise.all(formValues.speciesDetails.map(async (species, index) => ({
            ...species,
            sampleQuantity: Number(species.sampleQuantity),
            speciesPhotos: speciesFiles[index] ? 
              (typeof speciesFiles[index][0] === 'string' ? 
                speciesFiles[index] : 
                await uploadAllFiles(speciesFiles[index])) : 
              []
          })))
        };

        await updateTask(params.id, processedFormValues);
        navigate('/tasks');
        return;
      }

      // Resto del código existente para crear nueva tarea
      // ...existing code...
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSpeciesChange = (index, field, value) => {
    const newSpeciesDetails = [...formData.speciesDetails];
    newSpeciesDetails[index][field] = value;
    setFormData(prev => ({
      ...prev,
      speciesDetails: newSpeciesDetails
    }));
  };

  // Modificar handleFileChange para manejar ambos tipos de archivos
  const handleFileChange = (e, field, index) => {
    const files = Array.from(e.target.files);
    if (field === 'samplingPhotos') {
      setSamplingFiles(files);
    } else if (field === 'speciesPhotos') {
      const newSpeciesFiles = [...speciesFiles];
      newSpeciesFiles[index] = files;
      setSpeciesFiles(newSpeciesFiles);
    }
  };

  // Modificar addSpecies para inicializar el array de archivos
  const addSpecies = () => {
    setFormData(prev => ({
      ...prev,
      speciesDetails: [...prev.speciesDetails, {
        scientificName: '',
        commonName: '',
        family: '',
        sampleQuantity: 0,
        plantState: '',
        speciesPhotos: []
      }]
    }));
    setSpeciesFiles([...speciesFiles, []]); // Añadir esta línea
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">Guardando muestra...</p>
          </div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6">Nueva Muestra Botánica</h1>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Título:</label>
          <input
            {...register("title", { 
              required: "El título es requerido",
              minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" }
            })}
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block mb-2">Fecha y Hora de Muestreo:</label>
          <input
            {...register("samplingDateTime", { required: "La fecha es requerida" })}
            type="datetime-local"
            value={formData.samplingDateTime}
            onChange={(e) => setFormData({...formData, samplingDateTime: e.target.value})}
            className="w-full p-2 border rounded"
          />
          {errors.samplingDateTime && <span className="text-red-500 text-sm">{errors.samplingDateTime.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Latitud:</label>
            <input
              type="number"
              value={formData.location.latitude}
              onChange={(e) => setFormData({...formData, location: {...formData.location, latitude: parseFloat(e.target.value)}})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Longitud:</label>
            <input
              type="number"
              value={formData.location.longitude}
              onChange={(e) => setFormData({...formData, location: {...formData.location, longitude: parseFloat(e.target.value)}})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Condiciones Climáticas:</label>
          <input
            {...register("weatherConditions", { required: "Las condiciones climáticas son requeridas" })}
            type="text"
            value={formData.weatherConditions}
            onChange={(e) => setFormData({...formData, weatherConditions: e.target.value})}
            className="w-full p-2 border rounded"
          />
          {errors.weatherConditions && <span className="text-red-500 text-sm">{errors.weatherConditions.message}</span>}
        </div>

        <div>
          <label className="block mb-2">Descripción del Hábitat:</label>
          <textarea
            {...register("habitatDescription", { 
              required: "La descripción del hábitat es requerida",
              minLength: { value: 10, message: "La descripción debe tener al menos 10 caracteres" }
            })}
            className="w-full p-2 border rounded"
          />
          {errors.habitatDescription && <span className="text-red-500 text-sm">{errors.habitatDescription.message}</span>}
        </div>

        <div>
          <label className="block mb-2">Fotos del Muestreo:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {samplingFiles && samplingFiles.map((url, idx) => (
              typeof url === 'string' && (
                <img 
                  key={idx} 
                  src={url} 
                  alt={`Muestreo ${idx + 1}`} 
                  className="w-24 h-24 object-cover rounded"
                />
              )
            ))}
          </div>
          <input
            type="file"
            multiple
            {...register("samplingPhotos", { 
              required: params.id ? false : "Las fotos del muestreo son requeridas" 
            })}
            onChange={(e) => handleFileChange(e, 'samplingPhotos')}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {errors.samplingPhotos && <span className="text-red-500 text-sm">{errors.samplingPhotos.message}</span>}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Detalles de Especies</h3>
          {formData.speciesDetails.map((species, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Nombre Científico:</label>
                  <input
                    type="text"
                    {...register(`speciesDetails.${index}.scientificName`, { 
                      required: "El nombre científico es requerido",
                      // pattern: {
                      //   value: /^[A-Z][a-z]+ [a-z]+$/,
                      //   message: "Formato: Género especie (ej: Quercus alba)"
                      // }
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.speciesDetails?.[index]?.scientificName && 
                    <span className="text-red-500 text-sm">{errors.speciesDetails[index].scientificName.message}</span>}
                </div>
                <div>
                  <label className="block mb-2">Nombre Común:</label>
                  <input
                    type="text"
                    {...register(`speciesDetails.${index}.commonName`, { 
                      required: "El nombre común es requerido"
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.speciesDetails?.[index]?.commonName && 
                    <span className="text-red-500 text-sm">{errors.speciesDetails[index].commonName.message}</span>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2">Familia:</label>
                <input
                  type="text"
                  {...register(`speciesDetails.${index}.family`, { 
                    required: "La familia es requerida"
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.speciesDetails?.[index]?.family && 
                  <span className="text-red-500 text-sm">{errors.speciesDetails[index].family.message}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2">Cantidad de Muestra:</label>
                  <input
                    type="number"
                    {...register(`speciesDetails.${index}.sampleQuantity`, { 
                      required: "La cantidad es requerida",
                      min: { value: 1, message: "Debe ser mayor a 0" }
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.speciesDetails?.[index]?.sampleQuantity && 
                    <span className="text-red-500 text-sm">{errors.speciesDetails[index].sampleQuantity.message}</span>}
                </div>
                <div>
                  <label className="block mb-2">Estado de la Planta:</label>
                  <input
                    type="text"
                    {...register(`speciesDetails.${index}.plantState`, { 
                      required: "El estado de la planta es requerido"
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.speciesDetails?.[index]?.plantState && 
                    <span className="text-red-500 text-sm">{errors.speciesDetails[index].plantState.message}</span>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2">Fotos de la Especie:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {speciesFiles[index] && speciesFiles[index].map((url, idx) => (
                    typeof url === 'string' && (
                      <img 
                        key={idx} 
                        src={url} 
                        alt={`Especie ${index + 1} foto ${idx + 1}`} 
                        className="w-24 h-24 object-cover rounded"
                      />
                    )
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, 'speciesPhotos', index)}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {errors.speciesDetails?.[index]?.speciesPhotos && 
                  <span className="text-red-500 text-sm">{errors.speciesDetails[index].speciesPhotos.message}</span>}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecies}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Especie
          </button>
        </div>

        <div>
          <label className="block mb-2">Observaciones Adicionales:</label>
          <textarea
            {...register("additionalObservations")}
            className="w-full p-2 border rounded"
          />
          {errors.additionalObservations && 
            <span className="text-red-500 text-sm">{errors.additionalObservations.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Procesando...' 
            : params.id 
              ? 'Guardar Cambios' 
              : 'Guardar Muestra'}
        </button>
      </form>
    </div>
  );
}

export default TasksFormPage;
