import Task from "../Models/Task.model.js";
import json2csv from "json2csv";
import PDFDocument from "pdfkit";
import axios from 'axios';

export const exportToCSV = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .populate('user', 'username email')
            .populate('collaborators', 'username email')
            .lean();

        if (!task) {
            return res.status(404).json({ message: "Bitácora no encontrada" });
        }

        // Preparar datos de especies en formato tabular
        const speciesRows = task.speciesDetails.map(species => ({
            'ID Bitácora': task._id,
            'Título Bitácora': task.title,
            'Fecha Muestreo': new Date(task.samplingDateTime).toLocaleString(),
            'Ubicación': `${task.location?.latitude}, ${task.location?.longitude}`,
            'Condiciones Climáticas': task.weatherConditions,
            'Nombre Científico': species.scientificName,
            'Nombre Común': species.commonName,
            'Familia': species.family,
            'Cantidad': species.sampleQuantity,
            'Estado': species.plantState,
            'Hábitat': task.habitatDescription,
            'Observaciones': task.additionalObservations || '',
            'Usuario': task.user?.username,
            'Email Usuario': task.user?.email,
            'URLs Fotos Especie': (species.speciesPhotos || []).join('; '),
            'URLs Fotos Muestreo': (task.samplingPhotos || []).join('; ')
        }));

        // Configurar campos para el CSV
        const fields = [
            'ID Bitácora',
            'Título Bitácora',
            'Fecha Muestreo',
            'Ubicación',
            'Condiciones Climáticas',
            'Nombre Científico',
            'Nombre Común',
            'Familia',
            'Cantidad',
            'Estado',
            'Hábitat',
            'Observaciones',
            'Usuario',
            'Email Usuario',
            'URLs Fotos Especie',
            'URLs Fotos Muestreo'
        ];

        const opts = {
            fields,
            delimiter: ',',
            quote: '"',
            header: true
        };

        const csv = json2csv.parse(speciesRows, opts);
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=bitacora_${id}.csv`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        return res.status(200).send('\uFEFF' + csv); // Añadir BOM para soporte Unicode en Excel
    } catch (error) {
        console.error('Error en exportación CSV:', error);
        return res.status(500).json({ message: "Error al exportar CSV", error: error.message });
    }
};

export const exportToPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .populate('user', 'username email')
            .populate('collaborators', 'username email');

        if (!task) {
            return res.status(404).json({ message: "Bitácora no encontrada" });
        }

        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, left: 50, right: 50, bottom: 50 }
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bitacora_${id}.pdf`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        
        doc.pipe(res);

        // Funciones auxiliares para mejor organización
        const addPageIfNeeded = (doc, spaceNeeded = 150) => {
            if (doc.y + spaceNeeded > doc.page.height - 50) {
                doc.addPage();
            }
        };

        // Configuración inicial del documento
        doc.font('Helvetica-Bold').fontSize(24).text('Bitácora de Muestreo Botánico', {
            align: 'center',
            underline: true
        });
        doc.moveDown(2);

        // Información básica en formato de tabla
        doc.font('Helvetica-Bold').fontSize(16).text('Detalles Generales', { underline: true });
        doc.moveDown();
        
        const infoTable = {
            headers: ['Campo', 'Información'],
            rows: [
                ['Título', task.title],
                ['Fecha', new Date(task.samplingDateTime).toLocaleString()],
                ['Ubicación', `${task.location.latitude}, ${task.location.longitude}`],
                ['Clima', task.weatherConditions]
            ]
        };

        let currentX = 50;
        let currentY = doc.y;
        
        infoTable.headers.forEach((header, i) => {
            doc.font('Helvetica-Bold').fontSize(12)
               .text(header, currentX + (i * 250), currentY);
        });
        
        currentY += 20;
        infoTable.rows.forEach(row => {
            doc.font('Helvetica-Bold').fontSize(10)
               .text(row[0], currentX, currentY);
            doc.font('Helvetica').fontSize(10)
               .text(row[1], currentX + 250, currentY);
            currentY += 20;
        });

        doc.moveDown(2);

        // Descripción del hábitat
        addPageIfNeeded(doc);
        doc.font('Helvetica-Bold').fontSize(16)
           .text('Descripción del Hábitat', { underline: true });
        doc.font('Helvetica').fontSize(12)
           .text(task.habitatDescription, {
                width: 500,
                align: 'justify'
           });
        doc.moveDown(2);

        // Fotos del muestreo
        if (task.samplingPhotos?.length > 0) {
            addPageIfNeeded(doc);
            doc.font('Helvetica-Bold').fontSize(16)
               .text('Fotos del Muestreo', { underline: true });
            doc.moveDown();

            // Organizar fotos en grid de 2 columnas
            for (let i = 0; i < task.samplingPhotos.length; i += 2) {
                addPageIfNeeded(doc, 300);
                const row = task.samplingPhotos.slice(i, i + 2);
                
                for (let j = 0; j < row.length; j++) {
                    try {
                        const response = await axios.get(row[j], { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(response.data);
                        doc.image(imageBuffer, {
                            x: 50 + (j * 270),
                            width: 250,
                            height: 200,
                            fit: [250, 200]
                        });
                    } catch (error) {
                        console.error('Error al cargar imagen:', error);
                    }
                }
                doc.moveDown(15);
            }
        }

        // Especies encontradas
        doc.addPage();
        doc.font('Helvetica-Bold').fontSize(16)
           .text('Especies Encontradas', { underline: true });
        doc.moveDown();

        for (const species of task.speciesDetails) {
            addPageIfNeeded(doc, 400);
            
            // Información de la especie en un cuadro
            doc.rect(50, doc.y, 500, 100)
               .stroke();
            
            const speciesY = doc.y + 10;
            doc.font('Helvetica-Bold').fontSize(14)
               .text(species.scientificName, 60, speciesY);
            doc.font('Helvetica').fontSize(12)
               .text(`Nombre común: ${species.commonName}`, 60, speciesY + 20)
               .text(`Familia: ${species.family}`, 60, speciesY + 40)
               .text(`Cantidad: ${species.sampleQuantity}`, 60, speciesY + 60)
               .text(`Estado: ${species.plantState}`, 300, speciesY + 60);

            doc.moveDown(6);

            // Fotos de la especie en grid
            if (species.speciesPhotos?.length > 0) {
                for (let i = 0; i < species.speciesPhotos.length; i += 2) {
                    addPageIfNeeded(doc, 300);
                    const row = species.speciesPhotos.slice(i, i + 2);
                    
                    for (let j = 0; j < row.length; j++) {
                        try {
                            const response = await axios.get(row[j], { responseType: 'arraybuffer' });
                            const imageBuffer = Buffer.from(response.data);
                            doc.image(imageBuffer, {
                                x: 50 + (j * 270),
                                width: 250,
                                height: 200,
                                fit: [250, 200]
                            });
                        } catch (error) {
                            console.error('Error al cargar imagen de especie:', error);
                        }
                    }
                    doc.moveDown(15);
                }
            }
            doc.moveDown(2);
        }

        // Observaciones adicionales
        if (task.additionalObservations) {
            addPageIfNeeded(doc);
            doc.font('Helvetica-Bold').fontSize(16)
               .text('Observaciones Adicionales', { underline: true });
            doc.font('Helvetica').fontSize(12)
               .text(task.additionalObservations, {
                    width: 500,
                    align: 'justify'
               });
        }

        doc.end();
    } catch (error) {
        console.error('Error en exportación PDF:', error);
        return res.status(500).json({ message: "Error al exportar PDF", error: error.message });
    }
};