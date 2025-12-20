export const validateNepaliPhoneNumber = (_: any, value: string): Promise<void> => {
  if (!value) {
    return Promise.reject(new Error("Please enter a phone number"));
  }

  // Normalize input by removing all non-digit characters
  const normalized = value.replace(/\D/g, "");

  // Check for mobile numbers
  if (normalized.startsWith("977")) {
    const number = normalized.slice(3);
    if (
      number.length === 10 &&
      (number.startsWith("98") || number.startsWith("97"))
    ) {
      return Promise.resolve();
    }
  } else if (normalized.startsWith("98") || normalized.startsWith("97")) {
    if (normalized.length === 10) {
      return Promise.resolve();
    }
  }

  // Check for telephone numbers
  if (normalized.startsWith("977")) {
    const number = normalized.slice(3);
    if (number.length >= 7 && number.length <= 9 && number.match(/^[1-9]/)) {
      return Promise.resolve();
    }
  } else if (normalized.startsWith("0")) {
    if (
      normalized.length >= 8 &&
      normalized.length <= 10 &&
      normalized.match(/^0[1-9]/)
    ) {
      return Promise.resolve();
    }
  }

  return Promise.reject(
    new Error(
      "Please enter a valid Nepali phone number (e.g., 9841234567 or 01-1234567)"
    )
  );
};

export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  function appendValue(key: string, value: any): void {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      // Check if the array contains only File objects
      if (value.every(item => item instanceof File)) {
        value.forEach(file => {
          formData.append(key, file);
        });
      } else {
        // Handle other arrays with indexed keys
        value.forEach((item, index) => {
          appendValue(`${key}[${index}]`, item);
        });
      }
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendValue(`${key}[${subKey}]`, subValue);
      });
    } else {
      formData.append(key, String(value));
    }
  }

  Object.entries(obj).forEach(([key, value]) => {
    appendValue(key, value);
  });

  return formData;
}

export function removeFalsyValuesHandler<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => removeFalsyValuesHandler(item))
      .filter((item) => !(item == null || item === "")) as T; // remove null, undefined, ''
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = removeFalsyValuesHandler(value);
      if (
        cleanedValue !== null &&
        cleanedValue !== undefined &&
        cleanedValue !== ""
      ) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {} as any) as T;
  } else {
    return obj;
  }
}


export function capitalizeFirstWord(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


export function getLocationIdFromHtml(htmlString: string | null | undefined): string | null {
  if (!htmlString) return null;

  const parser = new DOMParser();
  const doc: Document = parser.parseFromString(htmlString, "text/html");

  const element = doc.querySelector<HTMLElement>("[data-location-id]");

  return element?.dataset?.locationId ?? null;
}
