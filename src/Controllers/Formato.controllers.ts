import type { Request, Response } from "express";
import Task from "../Models/Task.model.js";
import json2csv from "json2csv";
import PDFDocument from "pdfkit";
import axios from "axios";

export const exportToCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("user", "username email").lean();

    if (!task) {
      res.status(404).json({ message: "Bitácora no encontrada" });
      return;
    }

    const speciesRows = task.speciesDetails.map((species) => ({
      "ID Bitácora": task._id,
      Título: task.title,
      "Fecha Muestreo": new Date(task.samplingDateTime).toLocaleString(),
      Ubicación: `${task.location?.latitude}, ${task.location?.longitude}`,
      "Condiciones Climáticas": task.weatherConditions,
      "Nombre Científico": species.scientificName,
      "Nombre Común": species.commonName,
      Familia: species.family,
      Cantidad: species.sampleQuantity,
      Estado: species.plantState,
      Hábitat: task.habitatDescription,
      Observaciones: task.additionalObservations || "",
      Usuario: (task.user as any)?.username,
      "Email Usuario": (task.user as any)?.email,
      "URLs Fotos Especie": (species.speciesPhotos || []).join("; "),
      "URLs Fotos Muestreo": (task.samplingPhotos || []).join("; "),
    }));

    const fields = [
      "ID Bitácora",
      "Título",
      "Fecha Muestreo",
      "Ubicación",
      "Condiciones Climáticas",
      "Nombre Científico",
      "Nombre Común",
      "Familia",
      "Cantidad",
      "Estado",
      "Hábitat",
      "Observaciones",
      "Usuario",
      "Email Usuario",
      "URLs Fotos Especie",
      "URLs Fotos Muestreo",
    ];

    const opts = { fields, delimiter: ",", quote: '"', header: true };
    const csv = json2csv.parse(speciesRows, opts);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=bitacora_${id}.csv`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.status(200).send("\uFEFF" + csv);
  } catch (error: any) {
    console.error("Error en exportación CSV:", error);
    res.status(500).json({ message: "Error al exportar CSV", error: error.message });
  }
};

export const exportToPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("user", "username email");

    if (!task) {
      res.status(404).json({ message: "Bitácora no encontrada" });
      return;
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, left: 50, right: 50, bottom: 50 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=bitacora_${id}.pdf`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    doc.pipe(res);

    const addPageIfNeeded = (document: PDFKit.PDFDocument, spaceNeeded = 150): void => {
      if (document.y + spaceNeeded > document.page.height - 50) {
        document.addPage();
      }
    };

    doc.font("Helvetica-Bold").fontSize(24).text("Bitácora de Muestreo Botánico", {
      align: "center",
      underline: true,
    });
    doc.moveDown(2);

    doc.font("Helvetica-Bold").fontSize(16).text("Detalles Generales", { underline: true });
    doc.moveDown();

    const infoTable = {
      headers: ["Campo", "Información"],
      rows: [
        ["Título", task.title],
        ["Fecha", new Date(task.samplingDateTime).toLocaleString()],
        ["Ubicación", `${task.location.latitude}, ${task.location.longitude}`],
        ["Clima", task.weatherConditions],
      ],
    };

    let currentX = 50;
    let currentY = doc.y;

    infoTable.headers.forEach((header, i) => {
      doc.font("Helvetica-Bold").fontSize(12).text(header, currentX + i * 250, currentY);
    });

    currentY += 20;
    infoTable.rows.forEach((row) => {
      doc.font("Helvetica-Bold").fontSize(10).text(row[0], currentX, currentY);
      doc.font("Helvetica").fontSize(10).text(row[1], currentX + 250, currentY);
      currentY += 20;
    });

    doc.moveDown(2);

    addPageIfNeeded(doc);
    doc.font("Helvetica-Bold").fontSize(16).text("Descripción del Hábitat", { underline: true });
    doc.font("Helvetica").fontSize(12).text(task.habitatDescription, {
      width: 500,
      align: "justify",
    });
    doc.moveDown(2);

    if (task.samplingPhotos?.length > 0) {
      addPageIfNeeded(doc);
      doc.font("Helvetica-Bold").fontSize(16).text("Fotos del Muestreo", { underline: true });
      doc.moveDown();

      for (let i = 0; i < task.samplingPhotos.length; i += 2) {
        addPageIfNeeded(doc, 300);
        const row = task.samplingPhotos.slice(i, i + 2);

        for (let j = 0; j < row.length; j++) {
          try {
            const response = await axios.get(row[j], { responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data as ArrayBuffer);
            doc.image(imageBuffer, 50 + j * 270, doc.y, {
              width: 250,
              height: 200,
              fit: [250, 200],
            });
          } catch (imgError) {
            console.error("Error al cargar imagen:", imgError);
          }
        }
        doc.moveDown(15);
      }
    }

    doc.addPage();
    doc.font("Helvetica-Bold").fontSize(16).text("Especies Encontradas", { underline: true });
    doc.moveDown();

    for (const species of task.speciesDetails) {
      addPageIfNeeded(doc, 400);

      doc.rect(50, doc.y, 500, 100).stroke();

      const speciesY = doc.y + 10;
      doc.font("Helvetica-Bold").fontSize(14).text(species.scientificName, 60, speciesY);
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Nombre común: ${species.commonName}`, 60, speciesY + 20)
        .text(`Familia: ${species.family}`, 60, speciesY + 40)
        .text(`Cantidad: ${species.sampleQuantity}`, 60, speciesY + 60)
        .text(`Estado: ${species.plantState}`, 300, speciesY + 60);

      doc.moveDown(6);

      if (species.speciesPhotos && species.speciesPhotos.length > 0) {
        doc.moveDown();
        doc.font("Helvetica-Bold").fontSize(12).text("Fotos de la especie:", 60);
        doc.moveDown();

        let imgX = 50;
        let imgY = doc.y;
        const imageWidth = 250;
        const imageHeight = 200;
        const imagesPerRow = 2;

        for (let i = 0; i < species.speciesPhotos.length; i++) {
          if (i > 0 && i % imagesPerRow === 0) {
            imgX = 50;
            imgY += imageHeight + 20;
            addPageIfNeeded(doc, imageHeight + 50);
          }

          try {
            const response = await axios.get(species.speciesPhotos[i], {
              responseType: "arraybuffer",
              timeout: 5000,
            });

            const imageBuffer = Buffer.from(response.data as ArrayBuffer);
            doc.image(imageBuffer, imgX, imgY, {
              width: imageWidth,
              height: imageHeight,
              fit: [imageWidth, imageHeight],
            });

            imgX += imageWidth + 20;
          } catch (imgError) {
            console.error(`Error al cargar imagen de especie ${species.scientificName}:`, imgError);
            doc.text("Error al cargar imagen", imgX, imgY);
          }
        }

        doc.moveDown(imageHeight / 20 + 2);
      }

      doc.moveDown(2);
    }

    if (task.additionalObservations) {
      addPageIfNeeded(doc);
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Observaciones Adicionales", { underline: true });
      doc.font("Helvetica").fontSize(12).text(task.additionalObservations, {
        width: 500,
        align: "justify",
      });
    }

    doc.end();
  } catch (error: any) {
    console.error("Error en exportación PDF:", error);
    res.status(500).json({ message: "Error al exportar PDF", error: error.message });
  }
};
