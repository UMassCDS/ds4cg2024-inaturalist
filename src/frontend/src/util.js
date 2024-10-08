/* eslint-disable no-unused-vars */
import { generatePrediction, saveAnnotation, loadAnnotation } from "./api"; // import necessary functions from api

// parses taxa id from given string if it exists,
export function parseTaxaID(taxaString) {
  const split = taxaString.split("(")[1];
  return split ? split.slice(0, split.length - 1) : null;
}

export async function handleGeneratePrediction(data, handler) {
  // function with error handling, sets state for predictions hexagons
  try {
    handler.loadingHandlers.open();
    const response = await generatePrediction(data);

    if (response.prediction_hexagon_ids) {
      handler.setPredictionHexagonIDs(response.prediction_hexagon_ids);
    }
    if (response.annotation_hexagon_ids) {
      handler.setAnnotationHexagonIDs(response.annotation_hexagon_ids);
    }
    handler.loadingHandlers.close();
  } catch (error) {
    console.error("Error generating prediction:", error);
    alert("An unexpected error occurred.");
  } finally {
    handler.loadingHandlers.close();
  }
}

export async function handleSaveAnnotation(data, handler) {
  // function with error handling, saves on screen annotations
  try {
    handler.loadingHandlers.open();
    const response = await saveAnnotation(data);
    if (response instanceof Error) {
      console.error("Error save annotation:", response.message);
      alert("Operation failed. Please try again later.");
    }

    handler.loadingHandlers.close();
  } catch (error) {
    console.error("Error save annotation:", error);
    alert("An unexpected error occurred.");
  } finally {
    handler.loadingHandlers.close();
  }
}

export async function handleClearAnnotation(data, handler) {
  // function with error handling, clears annotation on screen
  try {
    handler.loadingHandlers.open();
    handler.setAnnotationHexagonIDs({ presence: [], absence: [] });
    handler.loadingHandlers.close();
  } catch (error) {
    console.error("Error clear annotation:", error);
    alert("An unexpected error occurred.");
  } finally {
    handler.loadingHandlers.close();
  }
}

export async function handleLoadAnnotation(data, handler) {
  // function with error handling, sets annotation hexagons with the most recent annotation to that species
  try {
    handler.loadingHandlers.open();
    const response = await loadAnnotation(data);
    if (response instanceof Error) {
      console.error("Error save annotation:", response.message);
      alert("Operation failed. Please try again later.");
    }

    if (response.annotation_hexagon_ids) {
      handler.setAnnotationHexagonIDs(response.annotation_hexagon_ids);
    }
    handler.loadingHandlers.close();
  } catch (error) {
    console.error("Error load annotation:", error);
    alert("An unexpected error occurred.");
  } finally {
    handler.loadingHandlers.close();
  }
}

export function handleAddAnnotationHexagonIDs(hexagonID, handler, switchData) {
  // function to handle added hexagon ids
  handler.setAnnotationHexagonIDs((prevAnnotationHexagonIDs) => {
    const newAnnotationHexagonIDs = {
      presence: new Set(prevAnnotationHexagonIDs.presence),
      absence: new Set(prevAnnotationHexagonIDs.absence),
    };

    for (const [type, hexIDs] of Object.entries(newAnnotationHexagonIDs)) {
      const isRemoved = hexIDs.delete(hexagonID);
      if (type === (switchData ? "presence" : "absence") && !isRemoved) {
        hexIDs.add(hexagonID);
      }
    }
    return {
      presence: Array.from(newAnnotationHexagonIDs.presence),
      absence: Array.from(newAnnotationHexagonIDs.absence),
    };
  });
}

export function handleAddAnnotationMultiSelect(
  hexagonIDs,
  isAddAnnotationMultiSelect,
  handler,
  isPresence
) {
  // function that handles multiselected hexagon ids
  handler.setAnnotationHexagonIDs((prevAnnotationHexagonIDs) => {
    const newAnnotationHexagonIDs = {
      presence: new Set(prevAnnotationHexagonIDs.presence),
      absence: new Set(prevAnnotationHexagonIDs.absence),
    };

    // Update hexagon sets based on the decided action
    for (const [type, hexIDs] of Object.entries(newAnnotationHexagonIDs)) {
      if (isAddAnnotationMultiSelect) {
        console.log("Adding");
        // If adding hexagons, remove them from the other layer and add to the current layer
        hexagonIDs.forEach((hexID) => hexIDs.delete(hexID));
        if (type === (isPresence ? "presence" : "absence")) {
          hexagonIDs.forEach((hexID) => hexIDs.add(hexID));
        }
      } else {
        console.log("Removing");
        // If removing hexagons, only remove them from the current layer
        if (type === (isPresence ? "presence" : "absence")) {
          hexagonIDs.forEach((hexID) => hexIDs.delete(hexID));
        }
      }
    }

    // Return the updated annotation hexagon IDs
    return {
      presence: Array.from(newAnnotationHexagonIDs.presence),
      absence: Array.from(newAnnotationHexagonIDs.absence),
    };
  });
}
