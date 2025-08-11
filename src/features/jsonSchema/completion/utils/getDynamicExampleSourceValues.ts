import { getAimAssistCategoryIds, getAimAssistPresetIds, getBlockIds, getEntityIds, getItemIds } from "../../../../utils/workspace/getContent";
import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";

export async function getDynamicExampleSourceValues(sourceKey: string | string[]): Promise<any[]> {
    const sourceKeys = Array.isArray(sourceKey) ? sourceKey : [sourceKey];
    const values: any[] = [];
    for (const key of sourceKeys) {
        switch (key) {
            case dynamicExamplesSourceKeys.aim_assist_category_ids:
                values.push(...await getAimAssistCategoryIds());
                break;
            case dynamicExamplesSourceKeys.aim_assist_preset_ids:
                values.push(...await getAimAssistPresetIds());
                break;
            case dynamicExamplesSourceKeys.block_ids:
                values.push(...await getBlockIds());
                break;
            case dynamicExamplesSourceKeys.entity_ids:
                values.push(...await getEntityIds());
                break;
            case dynamicExamplesSourceKeys.item_ids:
                values.push(...await getItemIds());
                break;
        }
    }

    return values;
}