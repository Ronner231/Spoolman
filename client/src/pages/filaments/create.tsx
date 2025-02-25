import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, ColorPicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { numberFormatter, numberParser } from "../../utils/parsing";
import { IVendor } from "../vendors/model";
import { IFilament } from "./model";

interface CreateOrCloneProps {
  mode: "create" | "clone";
}

export const FilamentCreate: React.FC<IResourceComponentsProps & CreateOrCloneProps> = (props) => {
  const t = useTranslate();

  const { formProps, saveButtonProps, formLoading } = useForm<IFilament>();

  if (props.mode === "clone" && formProps.initialValues) {
    // Fix the vendor_id
    if (formProps.initialValues.vendor) {
      formProps.initialValues.vendor_id = formProps.initialValues.vendor.id;
    }
  }

  const { selectProps } = useSelect<IVendor>({
    resource: "vendor",
    optionLabel: "name",
  });

  return (
    <Create
      title={props.mode === "create" ? "Create Filament" : "Clone Filament"}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={t("filament.fields.name")}
          help={t("filament.fields_help.name")}
          name={["name"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input maxLength={64} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.vendor")}
          name={["vendor_id"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            {...selectProps}
            allowClear
            filterSort={(a, b) => {
              return a?.label && b?.label
                ? (a.label as string).localeCompare(b.label as string, undefined, { sensitivity: "base" })
                : 0;
            }}
            filterOption={(input, option) =>
              typeof option?.label === "string" && option?.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.color_hex")}
          name={["color_hex"]}
          rules={[
            {
              required: false,
            },
          ]}
          getValueFromEvent={(e) => {
            return e?.toHex();
          }}
        >
          <ColorPicker format="hex" />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.material")}
          help={t("filament.fields_help.material")}
          name={["material"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input maxLength={64} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.price")}
          help={t("filament.fields_help.price")}
          name={["price"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} precision={2} formatter={numberFormatter} parser={numberParser} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.density")}
          name={["density"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="g/cm³" precision={2} formatter={numberFormatter} parser={numberParser} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.diameter")}
          name={["diameter"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="mm" precision={2} formatter={numberFormatter} parser={numberParser} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.weight")}
          help={t("filament.fields_help.weight")}
          name={["weight"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="g" precision={1} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.spool_weight")}
          help={t("filament.fields_help.spool_weight")}
          name={["spool_weight"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="g" precision={1} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.settings_extruder_temp")}
          name={["settings_extruder_temp"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="°C" precision={0} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.settings_bed_temp")}
          name={["settings_bed_temp"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber min={0} addonAfter="°C" precision={0} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.article_number")}
          help={t("filament.fields_help.article_number")}
          name={["article_number"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input maxLength={64} />
        </Form.Item>
        <Form.Item
          label={t("filament.fields.comment")}
          name={["comment"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <TextArea maxLength={1024} />
        </Form.Item>
      </Form>
    </Create>
  );
};

export default FilamentCreate;
