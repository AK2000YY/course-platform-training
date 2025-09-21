"use server";

import z from "zod";
import { getCurrentUser } from "@/services/clerk";
import { sectionSchema } from "../schemas/sections";
import {
  canCreateSection,
  canDeleteSection,
  canUpdateSection,
} from "../permisson/section";
import {
  getNextCousrseSectionOrder,
  insertSection,
  updateSection as dbUpdateSection,
  deleteSection as dbDeleteCoures,
  updateSectionsOrder as dbUpdateSectionsOrder,
} from "../db/section";

export async function createSection(
  courseId: string,
  unsafeData: z.infer<typeof sectionSchema>
) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canCreateSection(await getCurrentUser())) {
    return {
      error: true,
      message: "There is an error creating section",
    };
  }

  const order = await getNextCousrseSectionOrder(courseId);

  await insertSection({ courseId, ...data, order });

  return {
    error: false,
    message: "successfully created your section",
  };
}

export async function updateSection(
  id: string,
  unsafeData: z.infer<typeof sectionSchema>
) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canUpdateSection(await getCurrentUser())) {
    return {
      error: true,
      message: "There is an error updating section",
    };
  }

  await dbUpdateSection(id, data);

  return {
    error: false,
    message: "successfuly updating your section",
  };
}

export async function deleteSection(id: string) {
  if (!canDeleteSection(await getCurrentUser()))
    return {
      error: true,
      message: "Error delete your section",
    };
  await dbDeleteCoures(id);
  return {
    error: false,
    message: "Successfuly delete your section",
  };
}

export async function updateSectionsOrder(sectionsId: string[]) {
  if (sectionsId.length === 0 || !canUpdateSection(await getCurrentUser()))
    return {
      error: true,
      message: "error reordering your sections",
    };

  await dbUpdateSectionsOrder(sectionsId);

  return {
    error: false,
    message: "successfully reordering your sections",
  };
}
