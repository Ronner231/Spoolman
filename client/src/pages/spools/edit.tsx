import React, { useEffect, useState } from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, InputNumber, Radio } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { IFilament } from "../filaments/model";
import { ISpool } from "./model";
import { numberFormatter, numberParser } from "../../utils/parsing";

export const SpoolEdit: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { form, formProps, saveButtonProps } = useForm<ISpool>();

  const { queryResult } = useSelect<IFilament>({
    resource: "filament",
  });

  const filamentOptions = queryResult.data?.data.map((item) => {
    let vendorPrefix = "";
    if (item.vendor) {
      vendorPrefix = `${item.vendor.name} - `;
    }
    let name = item.name;
    if (!name) {
      name = `ID: ${item.id}`;
    }
    let material = "";
    if (item.material) {
      material = ` - ${item.material}`;
    }
    const label = `${vendorPrefix}${name}${material}`;

    return {
      label: label,
      value: item.id,
      weight: item.weight,
      spool_weight: item.spool_weight,
    };
  });
  filamentOptions?.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  const [weightToEnter, setWeightToEnter] = useState(1);
  const [usedWeight, setUsedWeight] = useState(0);

  const selectedFilamentID = Form.useWatch("filament_id", form);
  const selectedFilament = filamentOptions?.find((obj) => {
    return obj.value === selectedFilamentID;
  });
  const filamentWeight = selectedFilament?.weight || 0;
  const spoolWeight = selectedFilament?.spool_weight || 0;

  const filamentChange = (newID: number) => {
    const newSelectedFilament = filamentOptions?.find((obj) => {
      return obj.value === newID;
    });
    const newFilamentWeight = newSelectedFilament?.weight || 0;
    const newSpoolWeight = newSelectedFilament?.spool_weight || 0;

    if (weightToEnter >= 3) {
      if (!(newFilamentWeight && newSpoolWeight)) {
        setWeightToEnter(2);
      }
    }
    if (weightToEnter >= 2) {
      if (!newFilamentWeight) {
        setWeightToEnter(1);
      }
    }
  };

  const weightChange = (weight: number) => {
    setUsedWeight(weight);
    form.setFieldsValue({
      used_weight: weight,
    });
  };

  if (formProps.initialValues) {
    formProps.initialValues["filament_id"] = formProps.initialValues["filament"].id;
  }

  useEffect(() => {
    if (formProps.initialValues && usedWeight != formProps.initialValues["used_weight"]) {
      setUsedWeight(formProps.initialValues["used_weight"])
    }
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={t("spool.fields.id")}
          name={["id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.registered")}
          name={["registered"]}
          rules={[
            {
              required: true,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker disabled showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.first_used")}
          name={["first_used"]}
          rules={[
            {
              required: false,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.last_used")}
          name={["last_used"]}
          rules={[
            {
              required: false,
            },
          ]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.filament")}
          name={["filament_id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={filamentOptions}
            showSearch
            filterOption={(input, option) =>
              typeof option?.label === "string" && option?.label.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              filamentChange(value);
            }}
          />
        </Form.Item>
        <Form.Item hidden={false} name={["used_weight"]} initialValue={0}>
          <InputNumber value={usedWeight} />
        </Form.Item>

        <Form.Item label={t("spool.fields.weight_to_use")} help={t("spool.fields_help.weight_to_use")}>
          <Radio.Group
            onChange={(value) => {
              setWeightToEnter(value.target.value);
            }}
            defaultValue={1}
            value={weightToEnter}
          >
            <Radio.Button
              value={1}
            >
              {t("spool.fields.used_weight")}
            </Radio.Button>
            <Radio.Button
              value={2}
              disabled={!filamentWeight}
            >
              {t("spool.fields.remaining_weight")}
            </Radio.Button>
            <Radio.Button
              value={3}
              disabled={!(filamentWeight && spoolWeight)}
            >
              {t("spool.fields.measured_weight")}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("spool.fields.used_weight")}
          help={t("spool.fields_help.used_weight")}
          // name={["used_weight"]}
          // initialValue={usedWeight}
        >
          <InputNumber
            min={0}
            addonAfter="g"
            precision={1}
            formatter={numberFormatter}
            parser={numberParser}
            disabled={weightToEnter != 1}
            value={usedWeight}
            onChange={(value) => {
              weightChange(value ?? 0);
            }}
          />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.remaining_weight")}
          help={t("spool.fields_help.remaining_weight")}
          // name={["remaining_weight"]}
          // initialValue={filamentWeight ? filamentWeight - usedWeight : 0}
        >
          <InputNumber
            min={0}
            addonAfter="g"
            precision={1}
            formatter={numberFormatter}
            parser={numberParser}
            disabled={weightToEnter != 2}
            value={filamentWeight ? filamentWeight - usedWeight : 0}
            onChange={(value) => {
              weightChange(filamentWeight - (value ?? 0));
            }}
          />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.measured_weight")}
          help={t("spool.fields_help.measured_weight")}
          // name={["measured_weight"]}
          // initialValue={filamentWeight && spoolWeight ? filamentWeight - usedWeight + spoolWeight : 0}
        >
          <InputNumber
            min={0}
            addonAfter="g"
            precision={1}
            formatter={numberFormatter}
            parser={numberParser}
            disabled={weightToEnter != 3}
            value={filamentWeight && spoolWeight ? filamentWeight - usedWeight + spoolWeight : 0}
            onChange={(value) => {
              weightChange(filamentWeight - ((value ?? 0) - spoolWeight));
            }}
          />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.location")}
          help={t("spool.fields_help.location")}
          name={["location"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input maxLength={64} />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.lot_nr")}
          help={t("spool.fields_help.lot_nr")}
          name={["lot_nr"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input maxLength={64} />
        </Form.Item>
        <Form.Item
          label={t("spool.fields.comment")}
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
    </Edit>
  );
};

export default SpoolEdit;
