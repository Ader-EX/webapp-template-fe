// components/form/FormSearchableField.tsx
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import SearchableSelect from "@/components/SearchableSelect";
import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form";
import { consultingManagerService } from "@/services/consManagerService";

interface FormSearchableFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  isRequired?: boolean;
  fetchData: (
    search: string,
    dynamicParam?: any
  ) => Promise<{ data: any[]; total: number }>;
  renderLabel: (item: any) => string;
  fetchById?: (id: string | number) => Promise<any>;
  transform?: (value: any) => any;
  dynamicParam?: any;
}

export function FormSearchableField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isRequired = false,
  disabled = false,
  fetchData,
  renderLabel,
  fetchById,
  transform = (val: any) => val,
  dynamicParam,
}: FormSearchableFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <SearchableSelect
            key={`${name}-${dynamicParam}`}
            label={label}
            isRequired={isRequired}
            placeholder={placeholder}
            value={field.value ?? undefined}
            preloadValue={field.value}
            onChange={(value) => field.onChange(transform(value))}
            disabled={disabled}
            fetchById={fetchById}
            fetchData={(search) => fetchData(search, dynamicParam)}
            renderLabel={renderLabel}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SearchableFieldConfig {
  fetchData: (includeDeleted: boolean) => (
    search: string,
    dynamicParam?: any
  ) => Promise<{
    data: any[];
    total: number;
  }>;
  fetchById?: (id: string | number) => Promise<any>;
  renderLabel: (item: any) => string;
  transform?: (value: any) => any;
  requiresParam?: boolean;
}

const FIELD_CONFIGS: Record<string, SearchableFieldConfig> = {
  consulting_manager: {
    fetchData: (includeDeleted) => async (search) => {
      return await consultingManagerService.getAll({
        skip: 0,
        limit: 3,
        search: search,
      });
    },
    renderLabel: (item: any) => `${item.name} - ${item.email}`,
    transform: (val: any) => Number(val),
  },
};

interface QuickFormSearchableFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  type: keyof typeof FIELD_CONFIGS;
  label: string;
  placeholder: string;
  disabled?: boolean;
  isRequired?: boolean;
  dynamicParam?: any;
  watchField?: FieldPath<T>;
  showCondition?: (watchedValue: any) => boolean;
}

export function QuickFormSearchableField<T extends FieldValues>({
  control,
  name,
  type,
  label,
  isRequired,
  placeholder,
  disabled = false,
  dynamicParam,
  watchField,
  showCondition,
}: QuickFormSearchableFieldProps<T>) {
  const config = FIELD_CONFIGS[type];

  const watchedValue = watchField
    ? useWatch({
        control,
        name: watchField,
      })
    : null;

  const shouldShow = !showCondition || showCondition(watchedValue);

  if (!shouldShow) {
    return null;
  }

  return (
    <FormSearchableField
      control={control}
      name={name}
      isRequired={isRequired}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      fetchData={config.fetchData(false)}
      fetchById={config.fetchById}
      renderLabel={config.renderLabel}
      transform={config.transform}
      dynamicParam={dynamicParam}
    />
  );
}