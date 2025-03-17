interface IProps {
  a: string;
}

const Test = (props: IProps) => {
  const { a } = props;
  return <div>{a}</div>;
};

export default Test;
