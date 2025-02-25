import React from "react";
import {
  FaInfoCircle,
  FaShieldAlt,
  FaUser,
  FaDatabase,
  FaLink,
  FaHistory,
} from "react-icons/fa";

export default function Privacy() {
  return (
    <div className="p-[5%] pt-0">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4">
            Privacy Policy for Vibe Connect
          </h1>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Vibe Connect (“we,” “our,” or “us”) is committed to protecting your
            privacy. This Privacy Policy outlines how we collect, use, disclose,
            and safeguard your information when you use our property management
            application (the “App”). By accessing or using the App, you agree to
            the practices described in this Privacy Policy.
          </p>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaInfoCircle className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              We collect and process the following types of information:
            </p>

            <div className="ml-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2">
                  1.1 Personal Information
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
                  <li>
                    Name, email address, phone number, and other contact details
                  </li>
                  <li>Login credentials for accessing your account</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2">
                  1.2 Property and Module Data{" "}
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
                  <li>
                     Visitor records (e.g., names, purpose of visits, and
                    timestamps).
                  </li>
                  <li>
                     Event details (e.g., event descriptions, participant
                    lists, and schedules).
                  </li>
                  <li>
                     Notices and announcements shared within the application.
                  </li>
                  <li>
                     Billing information related to Common Area Maintenance
                    (CAM) and other property-related charges
                  </li>
                  <li> Poll responses and results.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2">
                  1.3 Device Information
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
                  <li>
                    Device type, operating system, IP address, and browser type
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2">
                  1.4 Usage Data
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
                  <li>
                    Pages visited, actions performed, and other analytical data
                    to improve the App
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
          <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
  <FaShieldAlt className="text-blue-500" />
  <h2 className="text-sm md:text-base lg:text-lg">
    2. How We Use Your Information
  </h2>
</div>
<p className="text-gray-600 text-sm md:text-base lg:text-lg px-6">
  We use the information we collect for the following purposes
</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
              <li>
                 To manage and enhance property-related activities, including
                visitor management, event coordination, and billing.
              </li>
              <li> To communicate important notices, updates, and alerts</li>
              <li>
                 To process billing and payment-related activities securely
              </li>
              <li>
                 To conduct polls and surveys to gather opinions and feedback.
              </li>
              <li> To ensure security and prevent unauthorized access.</li>
              <li>
                 To analyse usage trends and improve the App’s features and
                performance
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaUser Lock className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                3. How We Share Your Information
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              We do not sell, trade, or rent your personal information to third
              parties. However, we may share your information under the
              following circumstances:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
              <li>
                <span className="font-semibold">
                   With Property Administrators:
                </span>{" "}
                Relevant data is shared with property managers or administrators
                to facilitate property operations
              </li>
              <li>
                <span className="font-semibold"> Service Providers:</span> With
                trusted third-party vendors for services like payment
                processing, hosting, and analytics.
              </li>
              <li>
                <span className="font-semibold">Legal Compliance:</span> When
                required by law or to respond to legal processes
              </li>
              <li>
                <span className="font-semibold">Business Transfers:</span> : In
                case of a merger, acquisition, or sale of assets, your
                information may be transferred as part of the business assets.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaDatabase className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                4. Data Security
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              We use appropriate technical and organizational measures to secure
              your data against unauthorized access, loss, or misuse. However,
              no system can be completely secure, and we cannot guarantee the
              absolute security of your data.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaUser Lock className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                5. Your Rights
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              Depending on your jurisdiction, you may have the following rights
              regarding your data:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-600 text-sm md:text-base lg:text-lg">
              <li>
                <span className="font-semibold">
                   Access and Rectification:
                </span>{" "}
                : Request access to and correction of your personal data
              </li>
              <li>
                <span className="font-semibold"> Data Portability:</span>{" "}
                Obtain a copy of your data in a machine-readable format
              </li>
              <li>
                <span className="font-semibold"> Data Deletion:</span> Request
                the deletion of your personal data.
              </li>
              <li>
                <span className="font-semibold">  Opt-Out: :</span> Opt out of
                certain data collection or processing activities. To exercise
                these rights, contact us at [Your Contact Email].
              </li>
            </ul>
            {/* <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
              To exercise these rights, contact us at [Contact Email]
            </p> */}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaDatabase className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                6. Data Retention
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              We retain your data only for as long as necessary to fulfil the
              purposes outlined in this Privacy Policy or comply with legal
              obligations.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaLink className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                7. Third-Party Links
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              The App may include links to third-party websites or services. We
              are not responsible for the privacy practices or content of those
              third-party sites.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaHistory className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">
                8. Updates to This Privacy Policy
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. Any updates will
              be posted on this page, and the effective date will be revised
              accordingly.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold">
              <FaUser className="text-blue-500" />
              <h2 className="text-sm md:text-base lg:text-lg">9. Contact Us</h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us at: Vibe Connect
            </p>
            <div className=" bg-gray-100 ml-6 space-y-1 p-8 text-gray-600 text-sm md:text-base lg:text-lg">
              <h5>Vibe Connect</h5>
              <p>Email: info@vibecopilot.ai</p>
             
            </div>
          </section>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg pt-5">By using Vibe Connect, you acknowledge that you have read and understood this Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
