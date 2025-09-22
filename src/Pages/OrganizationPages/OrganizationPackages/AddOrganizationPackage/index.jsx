import CustomCard from "@/components/Cards/CustomCard";
import AdminWrappers from "@/components/ContentWrappers/AdminWrappers";
import CustomCkEditor from "@/components/forms/CustomCkEditor";
import CustomSingleImageUpload from "@/components/forms/CustomFileUpload/CustomSingleImageUpload";
import CustomUploadMultipleFiles from "@/components/forms/CustomFileUpload/CustomUploadMultipleFiles";
import CustomInput from "@/components/forms/CustomInput";
import CustomSelect from "@/components/forms/CustomSelect/CustomSelect";
import CustomSlider from "@/components/forms/CustomSlider";
import CustomSwitch from "@/components/forms/CustomSwitch";
import {
  packageRoomOptions,
  packageSeasonOptions,
  packageVehicleOptions,
} from "@/constant/constant";
import AddDestinationModal from "@/Pages/OrganizationPages/OrganizationPackages/AddOrganizationPackage/AddDestinationModal";
import { useFetchDestinations } from "@/services/destinationService";
import {
  useCreatePackage,
  useFetchPackageBySlug,
  useUpdatePackage,
} from "@/services/packageService";
import useAuthStore from "@/store/authStore";
import { objectToFormData } from "@/utils/helper";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  message,
  Row,
  Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const YOUTUBE_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}$/;

const countryOptions = [
  { label: "Nepal", value: "nepal", currency: "Rs" },
  { label: "India", value: "india", currency: "₹" },
  { label: "Other", value: "other", currency: "$" },
];

const initialValues = {
  totalNights: 1,
  minTourists: 1,
  numGuides: 0,
  numPorters: 0,
  ageRange: [5, 80],
};

const AddOrganizationPackage = () => {
  const [acceptedProfileImageFile, setAcceptedProfileImage] = useState(null);
  const [acceptedMapImage, setAcceptedMapImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false);
  const [searchedDestination, setSearchedDestination] = useState("");

  const { packageSlug } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: packageDetail, refetch } = useFetchPackageBySlug(
    packageSlug || ""
  );
  const { mutateAsync, isPending } = useCreatePackage();
  const { mutateAsync: updateMutation, isPending: isUpdating } =
    useUpdatePackage();
  const [form] = Form.useForm();
  const { data: destinationData } = useFetchDestinations({ no_pagination: 1 });

  const destinations_options = useMemo(
    () =>
      destinationData?.data?.map((item) => ({
        label: item?.title,
        value: item?.id,
      })),
    [destinationData]
  );

  useEffect(() => {
    if (packageSlug && packageDetail) {
      const selectedDestinations = packageDetail?.destinations?.map(
        (item) => item?.id
      );

      const selectedCountryPrice = packageDetail?.prices?.map(
        (item) => item?.country
      );
      const selectedCountryPriceDetails = packageDetail?.prices?.reduce(
        (acc, item) => {
          const { country, ...rest } = item;
          acc[country] = rest;
          return acc;
        },
        {}
      );

      form.setFieldsValue({
        ...packageDetail,
        destinations: selectedDestinations,
        selectedCountries: selectedCountryPrice,
        prices: selectedCountryPriceDetails,
      });
    }
  }, [packageSlug, packageDetail]);

  const onSubmitHandler = async (values) => {
    try {
      const isPricesObject =
        values?.prices &&
        typeof values.prices === "object" &&
        !Array.isArray(values.prices);
      const formatedPrice = isPricesObject
        ? Object.entries(values.prices)?.map(([country, details]) => ({
            country,
            ...details,
          }))
        : values?.prices || [];

      const payloadFormat = {
        ...values,
        prices: formatedPrice,
        insuranceRequired: values?.insuranceRequired || false,
        profileImage: acceptedProfileImageFile,
        tripMapImage: acceptedMapImage,
        images: fileList,
        organizationId: user?.organizationId,
        ageRange: values?.ageRange?.map((item) => parseInt(item)),
      };

      if (packageSlug) {
        const updateResponse = await updateMutation({
          payloads: objectToFormData(payloadFormat),
          slug: packageSlug,
        });

        if (updateResponse?.status == 200) {
          navigate(-1);
          message.success("Package details updated successfully");
        }
      } else {
        const createResponse = await mutateAsync(
          objectToFormData(payloadFormat)
        );

        if (createResponse?.status == 201) {
          navigate(-1);
          message.success("Package created successfully");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AdminWrappers>
        <CustomCard title={"Add Travel Packages"}>
          <Form
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onFinish={onSubmitHandler}
          >
            <CustomCard title={"General Details"} type={"inner"}>
              <Row gutter={[16, 8]}>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Title"}
                    name={"title"}
                    rules={[
                      {
                        required: true,
                        message: "Title is required",
                      },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Destinations"}
                    name={"destinations"}
                    rules={[
                      {
                        required: true,
                        message: "Atleast one destination is required",
                      },
                    ]}
                  >
                    <CustomSelect
                      isMultiple={true}
                      options={destinations_options}
                      onSearch={(value) => setSearchedDestination(value)}
                      onAddNew={() => setIsAddDestinationOpen(true)}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Total Nights"}
                    name={"totalNights"}
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject("Total Night's is required");
                          }
                          if (value && value < 1) {
                            return Promise.reject(
                              "Night's cannot be less then 1"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <CustomInput min={0} type="number" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Min Tourist No."}
                    name={"minTourists"}
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Minimum Tourist No. is required is required"
                            );
                          }
                          if (value && value < 1) {
                            return Promise.reject(
                              "Minimum Tourist No. cannot be less then 1"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <CustomInput min={0} type="number" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Max Tourist No."}
                    name={"maxTourists"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && value < 1) {
                            return Promise.reject(
                              "Max Tourist No. cannot be less then 1"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <CustomInput min={0} type="number" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Vehicles"}
                    name={"vehicleType"}
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one vehicle",
                      },
                    ]}
                  >
                    <CustomSelect
                      isMultiple={true}
                      options={packageVehicleOptions}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Room Type"}
                    name={"roomType"}
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one room type",
                      },
                    ]}
                  >
                    <CustomSelect
                      isMultiple={true}
                      options={packageRoomOptions}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Tooltip title={"Set to 0, if no guides available."}>
                    <Form.Item
                      label={"No. Of Guides"}
                      name={"numGuides"}
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value && value < 1) {
                              return Promise.reject(
                                " No. Of Guides cannot be less then 1"
                              );
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <CustomInput min={0} type="number" />
                    </Form.Item>
                  </Tooltip>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Tooltip title={"Set to 0 if no porters available. "}>
                    <Form.Item
                      label={"No. Of Porters"}
                      name={"numPorters"}
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value && value < 1) {
                              return Promise.reject(
                                " No. Of Porters cannot be less then 1"
                              );
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <CustomInput min={0} type="number" />
                    </Form.Item>
                  </Tooltip>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Preferred seasons"}
                    name={"preferSeasons"}
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one preferred season",
                      },
                    ]}
                  >
                    <CustomSelect
                      isMultiple={true}
                      options={packageSeasonOptions}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Form.Item
                    label={"Age Range"}
                    name={"ageRange"}
                    rules={[
                      {
                        required: true,
                        message: "Age range is required",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || value.length !== 2) {
                            return Promise.reject(
                              "Please select a valid age range"
                            );
                          }
                          const [minAge, maxAge] = value;
                          if (maxAge - minAge < 10) {
                            return Promise.reject(
                              "Age range must be at least 10 years apart"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <CustomSlider
                      min={0}
                      max={120}
                      range={true}
                      marks={{
                        5: "5Y",
                        18: "18Y",
                        40: "40Y",
                        80: "80Y",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={8} sm={12} xs={24}>
                  <Tooltip
                    title={"If insurance is required for users"}
                    placement="topLeft"
                  >
                    <Form.Item
                      label={"Is Insurance required"}
                      name={"insuranceRequired"}
                    >
                      <CustomSwitch />
                    </Form.Item>
                  </Tooltip>
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                  <Tooltip
                    title={
                      "Add Tags for finding your package fast and easy track by users"
                    }
                  >
                    <Form.Item
                      name="tags"
                      label="Tags"
                      rules={[
                        {
                          required: true,
                          message: "At least one tag is required",
                          type: "array",
                          min: 1,
                        },
                      ]}
                    >
                      <CustomSelect
                        mode="tags"
                        placeholder="Add tags (e.g., nature, adventure)"
                      />
                    </Form.Item>
                  </Tooltip>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label={"Description"}
                    name={"description"}
                    rules={[
                      {
                        required: true,
                        message: "Short overview about package is required",
                      },
                    ]}
                  >
                    <CustomInput
                      placeholder={"Short overview about package"}
                      type="textarea"
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </CustomCard>
            <CustomCard type={"inner"} className={"my-2"} title={"Images"}>
              <Row gutter={[16, 8]}>
                <Col xl={4} lg={6} md={6} sm={12} xs={24}>
                  <Form.Item label={"Package Profile Image"}>
                    <CustomSingleImageUpload
                      imageId={packageDetail?.profileImage?.id || ""}
                      imagePreviewSrc={packageDetail?.profileImage?.path || ""}
                      onChange={(file) => setAcceptedProfileImage(file)}
                      onDeleteSuccessCall={refetch}
                    />
                  </Form.Item>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12} xs={24}>
                  <Form.Item label={"Package Travel Map Image"}>
                    <CustomSingleImageUpload
                      imageId={packageDetail?.tripMapImage?.id || ""}
                      imagePreviewSrc={packageDetail?.tripMapImage?.path || ""}
                      onChange={(file) => setAcceptedMapImage(file)}
                      onDeleteSuccessCall={refetch}
                    />
                  </Form.Item>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12} xs={24}>
                  <Form.Item
                    name="youtubeLink"
                    label="YouTube Video URL"
                    rules={[
                      // {
                      //   required: true,
                      //   message: "Please enter a YouTube video URL",
                      // },
                      {
                        pattern: YOUTUBE_REGEX,
                        message: "Please enter a valid YouTube video URL ",
                      },
                    ]}
                  >
                    <CustomInput
                      type="textarea"
                      placeholder="Enter YouTube video URL"
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                  <Form.Item label="Images">
                    <CustomUploadMultipleFiles
                      setAcceptMultipleFiles={setFileList}
                      onDeleteSuccessCall={refetch}
                      imageList={packageDetail?.images?.map((item) => ({
                        id: item?.id,
                        path: item?.path,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </CustomCard>
            <CustomCard type={"inner"} className={"my-2"} title={"Prices"}>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Form.Item
                    label="Select Countries"
                    name="selectedCountries"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one country",
                      },
                    ]}
                  >
                    <CustomSelect isMultiple={true} options={countryOptions} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev.selectedCountries !== curr.selectedCountries
                }
              >
                {() => {
                  const selectedCountries =
                    form.getFieldValue("selectedCountries") || [];

                  return selectedCountries.map((country) => (
                    <div
                      key={country}
                      style={{
                        border: "1px solid #f0f0f0",
                        padding: 12,
                        marginBottom: 16,
                        borderRadius: 6,
                      }}
                    >
                      <Divider orientation="left" plain>
                        {countryOptions.find((c) => c.value === country)?.label}{" "}
                        Pricing
                      </Divider>
                      <Row gutter={[16, 8]}>
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <Form.Item
                            label="Price"
                            name={["prices", country, "price"]}
                            rules={[
                              { required: true, message: "Price is required" },
                              {
                                type: "number",
                                min: 0,
                                message: "Price must be ≥ 0",
                              },
                            ]}
                          >
                            <CustomInput
                              addonBefore={
                                countryOptions.find((c) => c.value === country)
                                  ?.currency
                              }
                              type="number"
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <Form.Item
                            name={["prices", country, "hasDiscount"]}
                            valuePropName="checked"
                            label="Has Discount"
                          >
                            <Checkbox>Apply Discount</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <Form.Item noStyle shouldUpdate>
                            {() =>
                              form.getFieldValue([
                                "prices",
                                country,
                                "hasDiscount",
                              ]) ? (
                                <Form.Item
                                  label="Discount Percent"
                                  name={["prices", country, "discountPercent"]}
                                  rules={[
                                    {
                                      type: "number",
                                      min: 0,
                                      max: 50,
                                      message: "Must be between 0–50",
                                    },
                                  ]}
                                >
                                  <CustomInput
                                    type={"number"}
                                    min={0}
                                    max={50}
                                  />
                                </Form.Item>
                              ) : null
                            }
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ));
                }}
              </Form.Item>
            </CustomCard>
            <CustomCard type={"inner"} className={"my-2"} title={"Iteneraries"}>
              <Form.List
                name={"itinerary"}
                initialValue={[{ title: "Day 1", description: "" }]}
                rules={[
                  {
                    validator: async (_, iteneraries) => {
                      if (!iteneraries || iteneraries.length < 1) {
                        return Promise.reject(
                          "Atleast 1 day itenaries is required"
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    <Row gutter={[16, 8]}>
                      {fields?.map(({ key, name, ...restField }, index) => (
                        <>
                          <Col xs={24} md={12} lg={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "title"]}
                              label={`Itinerary title`}
                              rules={[
                                {
                                  required: true,
                                  message: "Title is required",
                                },
                              ]}
                            >
                              <CustomInput />
                            </Form.Item>
                          </Col>
                          <Col span={24} key={key}>
                            <Form.Item
                              {...restField}
                              name={[name, "description"]}
                              label={`Iteneraries details of day ${index + 1}`}
                              rules={[
                                {
                                  required: true,
                                  message: "Itinerary details is required",
                                },
                              ]}
                            >
                              <CustomCkEditor />
                            </Form.Item>

                            <Flex gap={8}>
                              {fields?.length - 1 == index ? (
                                <Button
                                  variant="filled"
                                  color="green"
                                  icon={<PlusOutlined />}
                                  onClick={() =>
                                    add(
                                      {
                                        title: `Day ${index + 2}`,
                                        itinerary: "",
                                      },
                                      index + 1
                                    )
                                  }
                                >
                                  Add
                                </Button>
                              ) : (
                                ""
                              )}
                              <Button
                                variant="filled"
                                color="red"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              >
                                Remove
                              </Button>
                            </Flex>
                            <Divider
                              variant="dotted"
                              style={{ borderColor: "#7cb305" }}
                            />
                          </Col>
                        </>
                      ))}
                    </Row>
                    {!fields?.length ? (
                      <Button
                        variant="filled"
                        color="green"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          add({
                            title: `Day 1`,
                            description: "",
                          })
                        }
                      >
                        Add Iteneraries
                      </Button>
                    ) : (
                      ""
                    )}
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </CustomCard>

            <div>
              {/* not using features for now  */}
              {/* <CustomCard className={"my-2"} title={"Features"} type={"inner"}>
              <Form.List
              name={"features"}
              initialValue={[
                {
                  title: "Destination",
                  value: "Nepal",
                  iconValue: "users",
                  },
                  ]}
                  >
                  {(fields, { add, remove }) => (
                    <Row gutter={[16, 8]}>
                    {fields?.map(({ key, name, ...restField }) => {
                      return (
                        <>
                        <Col key={key} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item
                        name={[name, "title"]}
                        label={"Title"}
                        {...restField}
                        >
                        <CustomInput />
                        </Form.Item>
                        </Col>
                        <Col key={key} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item
                        name={[name, "value"]}
                        label={"Value"}
                        {...restField}
                        >
                        <CustomInput />
                        </Form.Item>
                        </Col>
                        </>
                        );
                        })}
                        </Row>
                        )}
                        </Form.List>
                        </CustomCard> */}
            </div>
            <CustomCard
              type={"inner"}
              className={"my-2"}
              title={"Highlights Lists"}
            >
              <Form.List name="highlightLists">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        const isLast = index === fields.length - 1;

                        return (
                          <Row gutter={[16]} key={key} align="middle">
                            <Col xs={20} sm={21} md={22}>
                              <Form.Item
                                label={`Highlight ${index + 1}`}
                                {...restField}
                                name={name}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a value",
                                  },
                                ]}
                              >
                                <CustomInput placeholder="Enter highlight " />
                              </Form.Item>
                            </Col>

                            <Col xs={4} sm={3} md={2}>
                              <Flex className=" h-100 " align="center">
                                <Tooltip color="#cf4058" title={"Remove"}>
                                  <Button
                                    shape="circle"
                                    variant="filled"
                                    color="red"
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Col>
                            {isLast && (
                              <Button
                                variant="filled"
                                color="green"
                                icon={<PlusOutlined />}
                                onClick={() => add()}
                              >
                                Add
                              </Button>
                            )}
                          </Row>
                        );
                      })}

                      {fields.length === 0 && (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Highlights
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  );
                }}
              </Form.List>
            </CustomCard>
            <CustomCard
              type={"inner"}
              className={"my-2"}
              title={"Cost Include Lists"}
            >
              <Form.List name="costIncludesList">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        const isLast = index === fields.length - 1;

                        return (
                          <Row gutter={[16]} key={key} align="middle">
                            <Col xs={20} sm={21} md={22}>
                              <Form.Item
                                label={`Cost includes item No. ${index + 1}`}
                                {...restField}
                                name={name}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a value",
                                  },
                                ]}
                              >
                                <CustomInput placeholder="Enter cost include item " />
                              </Form.Item>
                            </Col>

                            <Col xs={4} sm={3} md={2}>
                              <Flex className=" h-100 " align="center">
                                <Tooltip color="#cf4058" title={"Remove"}>
                                  <Button
                                    shape="circle"
                                    variant="filled"
                                    color="red"
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Col>
                            {isLast && (
                              <Button
                                variant="filled"
                                color="green"
                                icon={<PlusOutlined />}
                                onClick={() => add()}
                              >
                                Add
                              </Button>
                            )}
                          </Row>
                        );
                      })}

                      {fields.length === 0 && (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Cost Include Items
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  );
                }}
              </Form.List>
            </CustomCard>
            <CustomCard
              type={"inner"}
              className={"my-2"}
              title={"Cost Exclude Lists"}
            >
              <Form.List name="costExcludesList">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        const isLast = index === fields.length - 1;

                        return (
                          <Row gutter={[16]} key={key} align="middle">
                            <Col xs={20} sm={21} md={22}>
                              <Form.Item
                                label={`Cost exclude item No. ${index + 1}`}
                                {...restField}
                                name={name}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a value",
                                  },
                                ]}
                              >
                                <CustomInput placeholder="Enter coost exclude item " />
                              </Form.Item>
                            </Col>

                            <Col xs={4} sm={3} md={2}>
                              <Flex className=" h-100 " align="center">
                                <Tooltip color="#cf4058" title={"Remove"}>
                                  <Button
                                    shape="circle"
                                    variant="filled"
                                    color="red"
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Col>
                            {isLast && (
                              <Button
                                variant="filled"
                                color="green"
                                icon={<PlusOutlined />}
                                onClick={() => add()}
                              >
                                Add
                              </Button>
                            )}
                          </Row>
                        );
                      })}

                      {fields.length === 0 && (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Cost Exclude Items
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  );
                }}
              </Form.List>
            </CustomCard>
            <CustomCard
              type={"inner"}
              className={"my-2"}
              title={"Notes lists for customers"}
            >
              <Form.List name="notesList">
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => {
                        const isLast = index === fields.length - 1;

                        return (
                          <Row gutter={[16]} key={key} align="middle">
                            <Col xs={20} sm={21} md={22}>
                              <Form.Item
                                label={`Note  item No. ${index + 1}`}
                                {...restField}
                                name={name}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a value",
                                  },
                                ]}
                              >
                                <CustomInput placeholder="Enter note  " />
                              </Form.Item>
                            </Col>

                            <Col xs={4} sm={3} md={2}>
                              <Flex className=" h-100 " align="center">
                                <Tooltip color="#cf4058" title={"Remove"}>
                                  <Button
                                    shape="circle"
                                    variant="filled"
                                    color="red"
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Col>
                            {isLast && (
                              <Button
                                variant="filled"
                                color="green"
                                icon={<PlusOutlined />}
                                onClick={() => add()}
                              >
                                Add
                              </Button>
                            )}
                          </Row>
                        );
                      })}

                      {fields.length === 0 && (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Cost Exclude Items
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  );
                }}
              </Form.List>
            </CustomCard>
            <Button
              loading={isPending || isUpdating}
              className="my-2"
              type="primary"
              htmlType="submit"
            >
              {packageSlug ? "Update" : "Submit"}
            </Button>
          </Form>{" "}
        </CustomCard>
      </AdminWrappers>

      <AddDestinationModal
        isModalOpen={isAddDestinationOpen}
        setIsModalOpen={setIsAddDestinationOpen}
        searchedDestination={searchedDestination}
        setSearchedDestination={setSearchedDestination}
        packageForm={form}
      />
    </>
  );
};

export default AddOrganizationPackage;
