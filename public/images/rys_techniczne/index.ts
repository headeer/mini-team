// Centralized imports for technical drawings so Next can bundle them
// Ensure these files exist in this directory.

import lyska_1_5_2_3 from "./lyska_1.5_2.3.png";
import lyska_1_5_2_3_2 from "./lyska_1.5_2.3_2.png";
import lyska_skarpowa from "./lyska_skarpowa.png";
import lyska_skarpowa_2 from "./lyska_skarpowa_2.png";
import lyzka_1_5_2_3_dash from "./lyzka_1_5-2_3.png";
import lyzka_1_5_2_3_dash_2 from "./lyzka_1_5-2_3_2.png";
import lyzka_hydr_1_5_2_3 from "./lyzka_hydr_1.5_2.3.png";
import lyzka_hydr_2_1_5_2_3 from "./lyzka_hydr_2_1.5_2.3.png";
import lyzka_hydr_2_3_3_5 from "./lyzka_hydr_2.3_3.5.png";
import lyzka_hydr_2_3_3 from "./lyzka_hydr_2.3_3.png";

export const technicalDrawingMap: Record<string, any> = {
  "lyska_1.5_2.3.png": lyska_1_5_2_3,
  "lyska_1.5_2.3_2.png": lyska_1_5_2_3_2,
  "lyska_skarpowa.png": lyska_skarpowa,
  "lyska_skarpowa_2.png": lyska_skarpowa_2,
  "lyzka_1_5-2_3.png": lyzka_1_5_2_3_dash,
  "lyzka_1_5-2_3_2.png": lyzka_1_5_2_3_dash_2,
  "lyzka_hydr_1.5_2.3.png": lyzka_hydr_1_5_2_3,
  "lyzka_hydr_2_1.5_2.3.png": lyzka_hydr_2_1_5_2_3,
  "lyzka_hydr_2.3_3.5.png": lyzka_hydr_2_3_3_5,
  "lyzka_hydr_2.3_3.png": lyzka_hydr_2_3_3,
};

export function getDrawingByName(name: string) {
  return technicalDrawingMap[name];
}


